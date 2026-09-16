import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import {
  createMockEnvironment,
  MockPayloadGenerator,
  type MockEnvironment,
} from 'relay-test-utils'
import { vi, type Mock } from 'vitest'
import type { OperationDescriptor } from 'relay-runtime'

import { NotificationSettings } from './NotificationSettings.tsx'
import { ToastProvider } from '../toast/ToastProvider.tsx'
import type { NotificationSettingsStoryQuery } from './__generated__/NotificationSettingsStoryQuery.graphql'

const VAPID_PUBLIC_KEY =
  'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkAoAxdO6WXXhz5bAtCAaJtAviaQ1u2YEh6xEde8uM'

const IPHONE_ENDPOINT = 'https://push.example.com/subscriptions/iphone-7f3a9c'

interface BrowserStubOptions {
  standalone: boolean
  permission: NotificationPermission
  pushApiAvailable: boolean
  endpoint?: string
  userAgent?: string
}

const IPHONE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'

type Subscribe = (options: {
  userVisibleOnly: boolean
  applicationServerKey: Uint8Array
}) => Promise<{
  toJSON: () => {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }
}>

/**
 * Eligibility and subscribing both go through real browser APIs, so each story
 * installs the browser state it means to depict.
 */
const stubPushBrowser = ({
  standalone,
  permission,
  pushApiAvailable,
  endpoint = IPHONE_ENDPOINT,
  userAgent = IPHONE_USER_AGENT,
}: BrowserStubOptions) => {
  Object.defineProperty(navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  })

  Object.defineProperty(navigator, 'maxTouchPoints', {
    value: 5,
    configurable: true,
  })

  Object.defineProperty(window, 'matchMedia', {
    value: (query: string) => ({
      matches: query === '(display-mode: standalone)' && standalone,
    }),
    configurable: true,
  })

  Object.defineProperty(navigator, 'standalone', {
    value: standalone,
    configurable: true,
  })

  if (pushApiAvailable) {
    Object.defineProperty(window, 'PushManager', {
      value: class {},
      configurable: true,
    })
  } else {
    delete (window as unknown as Record<string, unknown>).PushManager
  }

  Object.defineProperty(Notification, 'permission', {
    value: permission,
    configurable: true,
  })

  const subscribe: Mock<Subscribe> = vi.fn(async () => ({
    toJSON: () => ({
      endpoint,
      keys: { p256dh: 'BmockP256dhKey', auth: 'mockAuthSecret' },
    }),
  }))

  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      ready: Promise.resolve({
        pushManager: {
          subscribe,
          getSubscription: vi.fn(async () => null),
        },
      }),
    },
    configurable: true,
  })

  const realFetch = globalThis.fetch
  Object.defineProperty(window, 'fetch', {
    value: (input: RequestInfo | URL) =>
      String(input).includes('/api/push/public-key')
        ? Promise.resolve(
            new Response(JSON.stringify({ publicKey: VAPID_PUBLIC_KEY }), {
              status: 200,
              headers: { 'content-type': 'application/json' },
            }),
          )
        : realFetch(input as RequestInfo),
    configurable: true,
  })

  return { subscribe }
}

const deviceMocks = {
  PushSubscription: () => ({
    id: 'push-subscription-1',
    endpoint: IPHONE_ENDPOINT,
    platform: 'iOS',
    createdAt: '2026-09-16T05:00:00.000Z',
    lastSeenAt: '2026-09-16T05:00:00.000Z',
  }),
}

/**
 * Every push mutation answers with `me`, so a mocked response has to describe
 * the resulting server state, which is what the component renders.
 */
const meWithDevices = (deviceCount: number) => ({
  User: () => ({
    id: 'user-1',
    morningReminderEnabled: deviceCount > 0,
    pushSubscriptions: Array.from({ length: deviceCount }, () => ({})),
  }),
  ...deviceMocks,
})

const withoutDevices = (operation: OperationDescriptor) =>
  MockPayloadGenerator.generate(operation, meWithDevices(0))

const withOneDevice = (operation: OperationDescriptor) =>
  MockPayloadGenerator.generate(operation, meWithDevices(1))

const NotificationSettingsStoryInner = () => {
  const data = useLazyLoadQuery<NotificationSettingsStoryQuery>(
    graphql`
      query NotificationSettingsStoryQuery @relay_test_operation {
        me {
          id
          ...NotificationSettings_me
        }
      }
    `,
    {},
  )

  return <NotificationSettings me={data.me} />
}

type StorySetup = (environment: MockEnvironment) => void

const NotificationSettingsStory = ({ setup }: { setup?: StorySetup }) => {
  const [environment] = useState(() => {
    const mockEnvironment = createMockEnvironment()
    setup?.(mockEnvironment)

    return mockEnvironment
  })

  if (!document.getElementById('toast-root')) {
    document.body.appendChild(document.createElement('div')).id = 'toast-root'
  }

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ToastProvider>
        <Suspense fallback="Loading...">
          <NotificationSettingsStoryInner />
        </Suspense>
      </ToastProvider>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'Settings/NotificationSettings',
  component: NotificationSettingsStory,
} satisfies Meta<typeof NotificationSettingsStory>

export default meta
type Story = StoryObj<typeof meta>

export const NotInstalledGuidance: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        stubPushBrowser({
          standalone: false,
          permission: 'granted',
          pushApiAvailable: true,
        })
        environment.mock.queueOperationResolver(withoutDevices)
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(
      await canvas.findByText('Add this app to your Home Screen first'),
    ).toBeInTheDocument()
    expect(
      canvas.queryByRole('button', { name: /enable reminders/i }),
    ).not.toBeInTheDocument()
  },
}

export const UnsupportedBrowserGuidance: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        stubPushBrowser({
          standalone: true,
          permission: 'default',
          pushApiAvailable: false,
        })
        environment.mock.queueOperationResolver(withoutDevices)
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(
      await canvas.findByText('This browser cannot receive push notifications'),
    ).toBeInTheDocument()
  },
}

export const PermissionDeniedGuidance: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        stubPushBrowser({
          standalone: true,
          permission: 'denied',
          pushApiAvailable: true,
        })
        environment.mock.queueOperationResolver(withoutDevices)
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(
      await canvas.findByText('Notifications are blocked for this app'),
    ).toBeInTheDocument()
    expect(
      canvas.queryByRole('button', { name: /enable reminders/i }),
    ).not.toBeInTheDocument()
  },
}

let subscribeSpy: Mock<Subscribe> = vi.fn()
let registerVariables: unknown

export const EnableSubscribesThisDevice: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        registerVariables = undefined
        subscribeSpy = stubPushBrowser({
          standalone: true,
          permission: 'granted',
          pushApiAvailable: true,
        }).subscribe

        environment.mock.queueOperationResolver(withoutDevices)
        environment.mock.queueOperationResolver(operation => {
          registerVariables = operation.request.variables
          return MockPayloadGenerator.generate(operation, meWithDevices(1))
        })
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const enable = await canvas.findByRole('button', {
      name: /enable reminders/i,
    })
    await userEvent.click(enable)

    expect(await canvas.findByText('iOS · 7f3a9c')).toBeInTheDocument()

    const [options] = subscribeSpy.mock.calls[0]
    expect(options.userVisibleOnly).toBe(true)
    expect(options.applicationServerKey).toBeInstanceOf(Uint8Array)
    expect(options.applicationServerKey).toHaveLength(65)

    expect(registerVariables).toMatchObject({
      input: {
        endpoint: IPHONE_ENDPOINT,
        keys: { p256dh: 'BmockP256dhKey', auth: 'mockAuthSecret' },
        platform: 'iOS',
      },
    })

    expect(
      await screen.findByText('This device now receives the morning reminder'),
    ).toBeInTheDocument()
  },
}

export const SubscribedDeviceList: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        stubPushBrowser({
          standalone: true,
          permission: 'granted',
          pushApiAvailable: true,
        })

        environment.mock.queueOperationResolver(withOneDevice)
        environment.mock.queueOperationResolver(operation =>
          MockPayloadGenerator.generate(operation, {
            ...meWithDevices(1),
            SendTestPushPayload: () => ({
              delivered: true,
              message: 'Test notification sent',
              deletedId: null,
            }),
          }),
        )
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(await canvas.findByText('iOS · 7f3a9c')).toBeInTheDocument()
    expect(
      canvas.getByRole('button', { name: /remove ios · 7f3a9c/i }),
    ).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: /send test/i }))

    expect(
      await screen.findByText('Test notification sent'),
    ).toBeInTheDocument()
  },
}

export const RemovesADevice: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        stubPushBrowser({
          standalone: true,
          permission: 'granted',
          pushApiAvailable: true,
        })

        environment.mock.queueOperationResolver(withOneDevice)
        environment.mock.queueOperationResolver(operation =>
          MockPayloadGenerator.generate(operation, {
            ...meWithDevices(0),
            RemovePushSubscriptionPayload: () => ({
              deletedId: 'push-subscription-1',
            }),
          }),
        )
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const remove = await canvas.findByRole('button', {
      name: /remove ios · 7f3a9c/i,
    })
    await userEvent.click(remove)

    await waitFor(() =>
      expect(canvas.queryByText('iOS · 7f3a9c')).not.toBeInTheDocument(),
    )
    expect(
      await canvas.findByRole('button', { name: /enable reminders/i }),
    ).toBeInTheDocument()
    expect(canvas.getByText('Not set up yet')).toBeInTheDocument()
  },
}

/**
 * The returning-user path: iOS hands back the endpoint it already gave this
 * install, the server upserts it, and the same device comes back in `me`. The
 * list must stay at one row and must not over-count.
 */
export const ReRegisteringThisDeviceKeepsOneRow: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        stubPushBrowser({
          standalone: true,
          permission: 'granted',
          pushApiAvailable: true,
        })

        environment.mock.queueOperationResolver(withOneDevice)
        environment.mock.queueOperationResolver(operation =>
          MockPayloadGenerator.generate(operation, meWithDevices(1)),
        )
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const add = await canvas.findByRole('button', { name: /add this device/i })
    await userEvent.click(add)

    expect(
      await screen.findByText('This device now receives the morning reminder'),
    ).toBeInTheDocument()

    expect(canvas.getAllByRole('listitem')).toHaveLength(1)
    expect(canvas.getAllByText('iOS · 7f3a9c')).toHaveLength(1)
    expect(canvas.getByText('Enabled on 1 device')).toBeInTheDocument()
  },
}

/**
 * A test send can discover that the push service has forgotten the subscription.
 * The server prunes the row and says so, and the UI has to follow it rather than
 * keep claiming the device is enabled.
 */
export const TestSendPrunesAStaleSubscription: Story = {
  render: () => (
    <NotificationSettingsStory
      setup={environment => {
        stubPushBrowser({
          standalone: true,
          permission: 'granted',
          pushApiAvailable: true,
        })

        environment.mock.queueOperationResolver(withOneDevice)
        environment.mock.queueOperationResolver(operation =>
          MockPayloadGenerator.generate(operation, {
            ...meWithDevices(0),
            SendTestPushPayload: () => ({
              delivered: false,
              message:
                'This subscription is no longer valid and has been removed',
              deletedId: 'push-subscription-1',
            }),
          }),
        )
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const sendTest = await canvas.findByRole('button', { name: /send test/i })
    await userEvent.click(sendTest)

    expect(
      await screen.findByText(
        'This subscription is no longer valid and has been removed',
      ),
    ).toBeInTheDocument()

    await waitFor(() =>
      expect(canvas.queryByText('iOS · 7f3a9c')).not.toBeInTheDocument(),
    )
    expect(canvas.queryByRole('listitem')).not.toBeInTheDocument()
    expect(
      canvas.getByRole('button', { name: /enable reminders/i }),
      'the server-derived state says reminders are no longer set up',
    ).toBeInTheDocument()
    expect(canvas.getByText('Not set up yet')).toBeInTheDocument()
  },
}
