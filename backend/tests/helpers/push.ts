import { executeGraphQL, type YogaApp } from './graphql.ts'
import { graphql } from '../gql/gql.ts'
import type { PushSender, PushSendResult } from '../../src/push/push-sender.ts'
import type { PushNotificationPayload } from '../../src/push/push-payload.ts'
import type { Kysely } from 'kysely'
import type { Database } from '../../src/database/types.ts'
import { getCurrentTimestamp } from '../../src/database/time.ts'

export interface FakePushSender extends PushSender {
  sends: Array<{ endpoint: string; payload: PushNotificationPayload }>
  /** Highest number of `send` calls outstanding at the same instant. */
  readonly maxInFlight: number
  setResult: (endpoint: string, result: PushSendResult) => void
  /** Makes `send` reject for this endpoint, as a socket-level failure would. */
  setThrow: (endpoint: string, error: unknown) => void
  /**
   * Makes every `send` wait on `release` before returning, so a test can hold
   * one evaluation mid-flight instead of racing on timers.
   */
  blockSends: (release: Promise<void>) => void
}

export const createFakePushSender = (): FakePushSender => {
  const sends: FakePushSender['sends'] = []
  const results = new Map<string, PushSendResult>()
  const throwers = new Map<string, unknown>()
  let release: Promise<void> | null = null
  let inFlight = 0
  let maxInFlight = 0

  return {
    sends,
    get maxInFlight() {
      return maxInFlight
    },
    setResult(endpoint, result) {
      results.set(endpoint, result)
    },
    setThrow(endpoint, error) {
      throwers.set(endpoint, error)
    },
    blockSends(promise) {
      release = promise
    },
    async send(subscription, payload) {
      sends.push({ endpoint: subscription.endpoint, payload })

      inFlight += 1
      maxInFlight = Math.max(maxInFlight, inFlight)

      try {
        // Always yield, otherwise an immediately-resolving sender looks
        // sequential even when the caller fans out.
        await (release ?? Promise.resolve())

        if (throwers.has(subscription.endpoint)) {
          throw throwers.get(subscription.endpoint)
        }

        return results.get(subscription.endpoint) ?? 'sent'
      } finally {
        inFlight -= 1
      }
    },
  }
}

export const pushEndpointFor = (label: string): string =>
  `https://push.example.com/subscriptions/${label}`

export const registerPushSubscription = async ({
  endpoint,
  platform,
  userAgent = 'RoutinesTest/1.0 (iPhone)',
  yoga,
  userToken,
}: {
  endpoint: string
  platform?: string
  userAgent?: string
  yoga: YogaApp
  userToken: string
}) =>
  await executeGraphQL(
    graphql(`
      mutation RegisterPushSubscriptionHelper(
        $endpoint: String!
        $platform: String
      ) {
        registerPushSubscription(
          input: {
            endpoint: $endpoint
            keys: { p256dh: "BMockP256dhKeyForTests", auth: "MockAuthSecret" }
            platform: $platform
          }
        ) {
          pushSubscription {
            id
            endpoint
            platform
            createdAt
            lastSeenAt
          }
          me {
            morningReminderEnabled
            pushSubscriptions {
              id
              endpoint
            }
          }
        }
      }
    `),
    { endpoint, platform },
    { yoga, userToken, headers: { 'user-agent': userAgent } },
  )

export const removePushSubscription = async ({
  endpoint,
  yoga,
  userToken,
}: {
  endpoint: string
  yoga: YogaApp
  userToken: string
}) =>
  await executeGraphQL(
    graphql(`
      mutation RemovePushSubscriptionHelper($endpoint: String!) {
        removePushSubscription(endpoint: $endpoint) {
          deletedId
          me {
            morningReminderEnabled
            pushSubscriptions {
              id
              endpoint
            }
          }
        }
      }
    `),
    { endpoint },
    { yoga, userToken },
  )

export const sendTestPush = async ({
  endpoint,
  yoga,
  userToken,
}: {
  endpoint: string
  yoga: YogaApp
  userToken: string
}) =>
  await executeGraphQL(
    graphql(`
      mutation SendTestPushHelper($endpoint: String!) {
        sendTestPush(endpoint: $endpoint) {
          delivered
          message
          deletedId
          me {
            morningReminderEnabled
            pushSubscriptions {
              id
              endpoint
            }
          }
        }
      }
    `),
    { endpoint },
    { yoga, userToken },
  )

export const insertPushSubscriptionRow = async (
  db: Kysely<Database>,
  userId: number,
  endpoint: string,
) =>
  await db
    .insertInto('push_subscriptions')
    .values({
      user_id: userId,
      endpoint,
      p256dh_key: 'BMockP256dhKeyForTests',
      auth_key: 'MockAuthSecret',
      platform: 'iOS',
      created_at: getCurrentTimestamp(),
      last_seen_at: getCurrentTimestamp(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
