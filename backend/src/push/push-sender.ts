import webPush from 'web-push'
import { getEnv } from '../env.ts'
import type { PushNotificationPayload } from './push-payload.ts'

export interface PushSubscriptionTarget {
  endpoint: string
  p256dhKey: string
  authKey: string
}

/**
 * `expired` means the push service told us the subscription is gone for good
 * (HTTP 404/410), so the caller should prune it rather than retry it forever.
 */
export type PushSendResult = 'sent' | 'expired' | { failed: string }

export interface PushSender {
  send(
    subscription: PushSubscriptionTarget,
    payload: PushNotificationPayload,
  ): Promise<PushSendResult>
}

export interface VapidConfig {
  publicKey: string
  privateKey: string
  subject: string
}

const ONE_HOUR_SECONDS = 60 * 60

/**
 * Endpoints are attacker-chosen URLs, so an endpoint that accepts the connection
 * and never answers is reachable. Without a socket timeout that black hole hangs
 * the whole daily run, and day N can still be running when day N+1 fires.
 */
const SEND_TIMEOUT_MS = 10_000

const GONE_STATUSES = [404, 410]

interface WebPushError {
  statusCode?: number
  message?: string
}

const httpStatusOf = (error: unknown): number | undefined =>
  typeof error === 'object' && error !== null && 'statusCode' in error
    ? (error as WebPushError).statusCode
    : undefined

const describeError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const { statusCode, message } = error as WebPushError
    if (statusCode && message) return `${statusCode}: ${message}`
    if (statusCode) return `Push service responded ${statusCode}`
    if (message) return message
  }

  return String(error)
}

export const createVapidPushSender = (config: VapidConfig): PushSender => {
  return {
    async send(subscription, payload) {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dhKey,
              auth: subscription.authKey,
            },
          },
          JSON.stringify(payload),
          {
            vapidDetails: {
              subject: config.subject,
              publicKey: config.publicKey,
              privateKey: config.privateKey,
            },
            TTL: ONE_HOUR_SECONDS,
            timeout: SEND_TIMEOUT_MS,
            // aes128gcm is RFC 8291: the legacy `aesgcm` coding is dropped by
            // Safari's push relay, so this must never fall back to it.
            contentEncoding: 'aes128gcm',
          },
        )

        return 'sent'
      } catch (error) {
        const status = httpStatusOf(error)

        if (status !== undefined && GONE_STATUSES.includes(status)) {
          return 'expired'
        }

        return { failed: describeError(error) }
      }
    },
  }
}

/**
 * Returns null when VAPID is unconfigured, which is how the rest of the app
 * distinguishes "push is off" from "push is on but this send failed".
 */
export const createPushSenderFromEnv = (): PushSender | null => {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = getEnv()

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return null

  return createVapidPushSender({
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
    subject: VAPID_SUBJECT,
  })
}
