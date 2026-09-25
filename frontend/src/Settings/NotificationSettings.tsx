import { useCallback, useMemo, useState } from 'react'
import { graphql, useFragment, useMutation } from 'react-relay'
import { format } from 'date-fns'
import { Send, Trash2, BellPlus } from 'lucide-react'
import { Alert } from '../primitives/Alert.tsx'
import type { AlertType } from '../primitives/Alert.tsx'
import { Button } from '../primitives/Button.tsx'
import { Body } from '../primitives/text/Body.tsx'
import { Heading } from '../primitives/text/Heading.tsx'
import { Mono } from '../primitives/text/Mono.tsx'
import { useToast } from '../toast/ToastContext.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import { getErrorMessage } from '../utils/errors.ts'
import { pluralise } from '../utils/text.ts'
import {
  getPermissionState,
  isPushCapable,
  isStandalone,
  subscribeCurrentDevice,
  unsubscribeCurrentDevice,
} from '../push/push-client.ts'
import type {
  NotificationSettings_me$data,
  NotificationSettings_me$key,
} from './__generated__/NotificationSettings_me.graphql.ts'
import type { NotificationSettingsRegisterMutation } from './__generated__/NotificationSettingsRegisterMutation.graphql.ts'
import type { NotificationSettingsRemoveMutation } from './__generated__/NotificationSettingsRemoveMutation.graphql.ts'
import type { NotificationSettingsSendTestMutation } from './__generated__/NotificationSettingsSendTestMutation.graphql.ts'
import styles from './NotificationSettings.module.css'

type Eligibility = 'ready' | 'not-installed' | 'unsupported' | 'denied'

type EligibilityView = {
  alertType: AlertType
  notice: { title: string; body: string } | null
}

const eligibilityView: Record<Eligibility, EligibilityView> = {
  ready: { alertType: 'info', notice: null },
  'not-installed': {
    alertType: 'info',
    notice: {
      title: 'Add this app to your Home Screen first',
      body: 'Open Routines in Safari, use Share › Add to Home Screen, then launch it from its icon. iOS only offers notifications to an installed app.',
    },
  },
  unsupported: {
    alertType: 'info',
    notice: {
      title: 'This browser cannot receive push notifications',
      body: 'Notifications need iOS 16.4 or newer, and a browser that exposes the Push API.',
    },
  },
  denied: {
    alertType: 'warning',
    notice: {
      title: 'Notifications are blocked for this app',
      body: 'Allow them in iOS Settings › Notifications › Routines, then reload this page.',
    },
  },
}

const deviceLabel = (subscription: {
  platform?: string | null
  endpoint: string
}): string =>
  `${subscription.platform ?? 'Device'} · ${subscription.endpoint.slice(-6)}`

type EnableActionProps = {
  eligibility: Eligibility
  hasDevices: boolean
  isSubscribing: boolean
  onEnable: () => void
}

const EnableAction = ({
  eligibility,
  hasDevices,
  isSubscribing,
  onEnable,
}: EnableActionProps) => {
  const { alertType, notice } = eligibilityView[eligibility]

  if (notice) {
    return (
      <Alert type={alertType} title={notice.title}>
        {notice.body}
      </Alert>
    )
  }

  return (
    <Button
      variant={hasDevices ? 'secondary' : 'primary'}
      leadingIcon={BellPlus}
      loading={isSubscribing}
      disabled={isSubscribing}
      onClick={onEnable}
    >
      {hasDevices ? 'Add this device' : 'Enable reminders'}
    </Button>
  )
}

type PushSubscription =
  NotificationSettings_me$data['pushSubscriptions'][number]

type DeviceListProps = {
  subscriptions: readonly PushSubscription[]
  pendingEndpoint: string | null
  onSendTest: (endpoint: string) => void
  onRemove: (endpoint: string) => void
}

const DeviceList = ({
  subscriptions,
  pendingEndpoint,
  onSendTest,
  onRemove,
}: DeviceListProps) => {
  if (subscriptions.length === 0) return null

  return (
    <ul className={styles.devices} aria-label="Subscribed devices">
      {subscriptions.map(subscription => (
        <li key={subscription.id} className={styles.device}>
          <div className={styles.deviceDetails}>
            <span className={styles.deviceName}>
              {deviceLabel(subscription)}
            </span>
            <Mono
              size="xs"
              className={styles.endpoint}
              title={subscription.endpoint}
            >
              {subscription.endpoint}
            </Mono>
            <span className={styles.deviceMeta}>
              Added {format(new Date(subscription.createdAt), 'd MMM yyyy')}
            </span>
          </div>
          <div className={styles.deviceActions}>
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={Send}
              disabled={pendingEndpoint !== null}
              loading={pendingEndpoint === subscription.endpoint}
              onClick={() => onSendTest(subscription.endpoint)}
            >
              Send test
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconOnly={Trash2}
              aria-label={`Remove ${deviceLabel(subscription)}`}
              disabled={pendingEndpoint !== null}
              loading={pendingEndpoint === subscription.endpoint}
              onClick={() => onRemove(subscription.endpoint)}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

type NotificationSettingsProps = {
  me: NotificationSettings_me$key
}

export const NotificationSettings = ({ me }: NotificationSettingsProps) => {
  const data = useFragment(
    graphql`
      fragment NotificationSettings_me on User {
        id
        morningReminderEnabled
        pushSubscriptions {
          id
          endpoint
          platform
          createdAt
        }
      }
    `,
    me,
  )

  const { showSuccess, showWarning, showError } = useToast()
  const { showPayloadErrors, showError: showMutationError } =
    useMutationErrorHandler()

  const [isSubscribing, setIsSubscribing] = useState(false)
  const [pendingEndpoint, setPendingEndpoint] = useState<string | null>(null)

  const eligibility = useMemo<Eligibility>((): Eligibility => {
    if (!isPushCapable()) return 'unsupported'
    if (!isStandalone()) return 'not-installed'
    if (getPermissionState() === 'denied') return 'denied'
    return 'ready'
  }, [])

  const subscriptions = data.pushSubscriptions

  const [registerPushSubscription] =
    useMutation<NotificationSettingsRegisterMutation>(graphql`
      mutation NotificationSettingsRegisterMutation(
        $input: RegisterPushSubscriptionInput!
      ) {
        registerPushSubscription(input: $input) {
          pushSubscription {
            id
          }
          me {
            ...NotificationSettings_me
          }
        }
      }
    `)

  const [removePushSubscription] =
    useMutation<NotificationSettingsRemoveMutation>(graphql`
      mutation NotificationSettingsRemoveMutation($endpoint: String!) {
        removePushSubscription(endpoint: $endpoint) {
          deletedId @deleteRecord
          me {
            ...NotificationSettings_me
          }
        }
      }
    `)

  const [sendTestPush] = useMutation<NotificationSettingsSendTestMutation>(
    graphql`
      mutation NotificationSettingsSendTestMutation($endpoint: String!) {
        sendTestPush(endpoint: $endpoint) {
          delivered
          message
          deletedId @deleteRecord
          me {
            ...NotificationSettings_me
          }
        }
      }
    `,
  )

  const handleEnable = useCallback(async () => {
    setIsSubscribing(true)

    try {
      const subscription = await subscribeCurrentDevice()

      registerPushSubscription({
        variables: {
          input: {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            platform: subscription.platform,
          },
        },
        onCompleted: (_response, errors) => {
          setIsSubscribing(false)
          if (showPayloadErrors(errors)) return
          showSuccess('This device now receives the morning reminder')
        },
        onError: error => {
          setIsSubscribing(false)
          showMutationError(error)
        },
      })
    } catch (error) {
      setIsSubscribing(false)
      showError(getErrorMessage(error))
    }
  }, [
    registerPushSubscription,
    showMutationError,
    showError,
    showSuccess,
    showPayloadErrors,
  ])

  const handleRemove = useCallback(
    (endpoint: string) => {
      setPendingEndpoint(endpoint)

      removePushSubscription({
        variables: { endpoint },
        onCompleted: (_response, errors) => {
          setPendingEndpoint(null)
          if (showPayloadErrors(errors)) return
          showSuccess('Device removed')
          void unsubscribeCurrentDevice(endpoint)
        },
        onError: error => {
          setPendingEndpoint(null)
          showMutationError(error)
        },
      })
    },
    [removePushSubscription, showMutationError, showPayloadErrors, showSuccess],
  )

  const handleSendTest = useCallback(
    (endpoint: string) => {
      setPendingEndpoint(endpoint)

      sendTestPush({
        variables: { endpoint },
        onCompleted: (response, errors) => {
          setPendingEndpoint(null)
          if (showPayloadErrors(errors)) return

          const result = response.sendTestPush
          if (!result) return

          if (result.delivered) {
            showSuccess(result.message)
          } else {
            showWarning(result.message)
          }
        },
        onError: error => {
          setPendingEndpoint(null)
          showMutationError(error)
        },
      })
    },
    [
      sendTestPush,
      showMutationError,
      showPayloadErrors,
      showSuccess,
      showWarning,
    ],
  )

  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <Heading as="h2" className={styles.heading}>
          Morning reminder
        </Heading>
        <Body size="sm" className={styles.copy}>
          A single notification at 09:00, only if no morning task has been
          ticked off yet that day.
        </Body>
        <Body size="sm" className={styles.state}>
          {data.morningReminderEnabled
            ? `Enabled on ${subscriptions.length} ${pluralise(subscriptions.length, 'device', 'devices')}`
            : 'Not set up yet'}
        </Body>
      </div>

      <EnableAction
        eligibility={eligibility}
        hasDevices={subscriptions.length > 0}
        isSubscribing={isSubscribing}
        onEnable={() => void handleEnable()}
      />

      <DeviceList
        subscriptions={subscriptions}
        pendingEndpoint={pendingEndpoint}
        onSendTest={handleSendTest}
        onRemove={handleRemove}
      />
    </div>
  )
}
