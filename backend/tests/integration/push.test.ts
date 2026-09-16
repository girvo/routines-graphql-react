import {
  afterAll,
  assert,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import {
  createTestApp,
  executeGraphQL,
  type YogaApp,
} from '../helpers/graphql.ts'
import { graphql } from '../gql/gql.ts'
import {
  createFakePushSender,
  pushEndpointFor,
  registerPushSubscription,
  removePushSubscription,
  sendTestPush,
} from '../helpers/push.ts'
import {
  createFakeHostResolver,
  PUBLIC_PUSH_ADDRESS,
} from '../helpers/host-resolver.ts'
import { db } from '../../src/database/index.ts'
import type { Database } from '../../src/database/types.ts'
import { fromGlobalId } from '../../src/globalId.ts'
import { UNSAFE_ENDPOINT_MESSAGE } from '../../src/push/endpoint-policy.ts'
import { testPushRateLimiter } from '../../src/push/rate-limit.ts'
import {
  NOTIFICATION_BODY,
  NOTIFICATION_TAG,
  NOTIFICATION_TITLE,
} from '../../src/push/push-payload.ts'

let yoga: YogaApp

const countRows = async (table: keyof Database): Promise<number> => {
  const row = await db
    .selectFrom(table)
    .select(db.fn.countAll<string>().as('total'))
    .executeTakeFirstOrThrow()

  return Number(row.total)
}

const mePushState = async (userToken: string) =>
  await executeGraphQL(
    graphql(`
      query MePushState {
        me {
          morningReminderEnabled
          pushSubscriptions {
            id
            endpoint
            platform
          }
        }
      }
    `),
    {},
    { yoga, userToken },
  )

beforeAll(async () => {
  const testApp = await createTestApp({ pushSender: createFakePushSender() })
  yoga = testApp.yoga
})

beforeEach(async () => {
  await clearAllTables()
  testPushRateLimiter.reset()
})

describe('registerPushSubscription', () => {
  it('stores the subscription, is idempotent per endpoint, and enables reminders', async () => {
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('ios-install')

    const first = await registerPushSubscription({
      endpoint,
      platform: 'iOS',
      yoga,
      userToken,
    })

    expect(first.errors).toBeUndefined()
    const created = first.data?.registerPushSubscription?.pushSubscription
    assert(created !== undefined, 'subscription was registered')
    expect(created.endpoint).toBe(endpoint)
    expect(created.platform).toBe('iOS')
    expect(created.lastSeenAt).toBe(created.createdAt)

    const second = await registerPushSubscription({
      endpoint,
      platform: 'iOS 18',
      userAgent: 'RoutinesTest/2.0 (iPhone)',
      yoga,
      userToken,
    })

    expect(second.errors).toBeUndefined()
    const updated = second.data?.registerPushSubscription?.pushSubscription
    assert(updated !== undefined, 'subscription was re-registered')

    expect(updated.id).toBe(created.id)
    expect(updated.platform).toBe('iOS 18')
    expect(updated.createdAt).toBe(created.createdAt)
    expect(updated.lastSeenAt).not.toBeNull()
    expect(await countRows('push_subscriptions')).toBe(1)

    const [stored] = await db
      .selectFrom('push_subscriptions')
      .selectAll()
      .execute()
    expect(stored.user_agent).toBe('RoutinesTest/2.0 (iPhone)')

    const me = await mePushState(userToken)
    expect(me.errors).toBeUndefined()
    expect(me.data?.me.morningReminderEnabled).toBe(true)
    expect(me.data?.me.pushSubscriptions).toHaveLength(1)
    expect(me.data?.me.pushSubscriptions[0].endpoint).toBe(endpoint)

    const ownerState = second.data?.registerPushSubscription?.me
    assert(ownerState !== undefined, 'payload carries the owner state')
    expect(
      ownerState.pushSubscriptions.map(sub => sub.endpoint),
      'the payload answers with the stored state, not a guess',
    ).toEqual([endpoint])
    expect(ownerState.morningReminderEnabled).toBe(true)
  })

  it('answers a re-registration with the one row the server kept', async () => {
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('same-install')

    const first = await registerPushSubscription({
      endpoint,
      platform: 'iOS',
      yoga,
      userToken,
    })
    const firstId = first.data?.registerPushSubscription?.pushSubscription.id
    assert(firstId !== undefined, 'subscription was registered')

    const again = await registerPushSubscription({
      endpoint,
      platform: 'iOS 18',
      yoga,
      userToken,
    })

    expect(again.errors).toBeUndefined()
    const state = again.data?.registerPushSubscription?.me
    assert(state !== undefined, 'payload carries the owner state')

    expect(state.pushSubscriptions).toHaveLength(1)
    expect(state.pushSubscriptions[0].id).toBe(firstId)
    expect(await countRows('push_subscriptions')).toBe(1)
  })

  it('reports reminders disabled while no subscription exists', async () => {
    const { userToken } = await createTestUser()

    const me = await mePushState(userToken)

    expect(me.errors).toBeUndefined()
    expect(me.data?.me.morningReminderEnabled).toBe(false)
    expect(me.data?.me.pushSubscriptions).toHaveLength(0)
  })

  it('rejects endpoints that are not https URLs', async () => {
    const { userToken } = await createTestUser()

    const result = await registerPushSubscription({
      endpoint: 'not-a-url',
      yoga,
      userToken,
    })

    expect(result.errors?.[0].message).toBe(
      'Push subscription endpoint must be a valid URL',
    )
    expect(await countRows('push_subscriptions')).toBe(0)
  })

  it('rejects endpoints that could be used to reach the server itself', async () => {
    const { userToken } = await createTestUser()

    const unsafeEndpoints = [
      'http://push.example.com/subscriptions/plaintext',
      'https://push.example.com:8443/subscriptions/nonstandard-port',
      'https://127.0.0.1:9/subscriptions/loopback',
      'https://2130706433/subscriptions/decimal-loopback',
      'https://0x7f000001/subscriptions/hex-loopback',
      'https://0177.0.0.1/subscriptions/octal-loopback',
      'https://[::1]/subscriptions/ipv6-loopback',
      'https://169.254.169.254/subscriptions/link-local-metadata',
      'https://10.0.0.5/subscriptions/private',
      'https://192.168.1.10/subscriptions/private',
      'https://[fd00::1]/subscriptions/unique-local',
      'https://[fe80::1]/subscriptions/ipv6-link-local',
      'https://[2001:db8::1]/subscriptions/documentation',
    ]

    for (const endpoint of unsafeEndpoints) {
      const result = await registerPushSubscription({
        endpoint,
        yoga,
        userToken,
      })

      expect(result.errors?.[0].message, endpoint).toBe(UNSAFE_ENDPOINT_MESSAGE)
    }

    expect(await countRows('push_subscriptions')).toBe(0)
  })

  it('rejects hosts whose addresses are not publicly reachable', async () => {
    const { userToken } = await createTestUser()
    const { yoga: guardedApp } = await createTestApp({
      pushSender: createFakePushSender(),
      hostResolver: createFakeHostResolver({
        'internal.example': ['10.0.0.5'],
        'split-view.example': [PUBLIC_PUSH_ADDRESS, '127.0.0.1'],
        'mapped.example': ['::ffff:127.0.0.1'],
        'missing.example': [],
      }),
    })

    for (const host of [
      'internal.example',
      'split-view.example',
      'mapped.example',
      'missing.example',
    ]) {
      const result = await registerPushSubscription({
        endpoint: `https://${host}/subscriptions/x`,
        yoga: guardedApp,
        userToken,
      })

      expect(result.errors?.[0].message, host).toBe(UNSAFE_ENDPOINT_MESSAGE)
    }

    expect(await countRows('push_subscriptions')).toBe(0)
  })

  it('accepts an explicit default port on an otherwise public endpoint', async () => {
    const { userToken } = await createTestUser()

    const result = await registerPushSubscription({
      endpoint: 'https://push.example.com:443/subscriptions/explicit-443',
      yoga,
      userToken,
    })

    expect(result.errors).toBeUndefined()
    expect(
      result.data?.registerPushSubscription?.pushSubscription.endpoint,
    ).toBe('https://push.example.com/subscriptions/explicit-443')
  })

  it('refuses to rewrite a subscription owned by another user', async () => {
    const { userToken: ownerToken } = await createTestUser()
    const { userToken: thiefToken } = await createTestUser()
    const endpoint = pushEndpointFor('taken')

    const ownerResult = await registerPushSubscription({
      endpoint,
      yoga,
      userToken: ownerToken,
    })
    const ownerId =
      ownerResult.data?.registerPushSubscription?.pushSubscription.id
    assert(ownerId !== undefined, 'owner registered the endpoint')

    const thiefResult = await registerPushSubscription({
      endpoint,
      platform: 'stolen',
      yoga,
      userToken: thiefToken,
    })

    expect(thiefResult.errors?.[0].message).toBe(
      'Push subscription belongs to another user',
    )
    expect(await countRows('push_subscriptions')).toBe(1)

    const owner = await mePushState(ownerToken)
    expect(owner.data?.me.pushSubscriptions[0].id).toBe(ownerId)
    expect(owner.data?.me.pushSubscriptions[0].platform).not.toBe('stolen')
  })
})

describe('removePushSubscription', () => {
  it('deletes the row and returns the global id for @deleteRecord', async () => {
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('to-remove')

    const registered = await registerPushSubscription({
      endpoint,
      yoga,
      userToken,
    })
    const globalId =
      registered.data?.registerPushSubscription?.pushSubscription.id
    assert(globalId !== undefined, 'subscription was registered')

    const removed = await removePushSubscription({ endpoint, yoga, userToken })

    expect(removed.errors).toBeUndefined()
    expect(removed.data?.removePushSubscription?.deletedId).toBe(globalId)
    expect(
      fromGlobalId(
        removed.data!.removePushSubscription!.deletedId,
        'PushSubscription',
      ),
    ).toBe(fromGlobalId(globalId, 'PushSubscription'))
    expect(await countRows('push_subscriptions')).toBe(0)

    const me = await mePushState(userToken)
    expect(me.data?.me.morningReminderEnabled).toBe(false)
  })

  it('answers a removal with the remaining owner state', async () => {
    const { userToken } = await createTestUser()
    const kept = pushEndpointFor('kept')
    const removed = pushEndpointFor('removed')

    await registerPushSubscription({ endpoint: kept, yoga, userToken })
    await registerPushSubscription({ endpoint: removed, yoga, userToken })

    const result = await removePushSubscription({
      endpoint: removed,
      yoga,
      userToken,
    })

    expect(result.errors).toBeUndefined()
    const state = result.data?.removePushSubscription?.me
    assert(state !== undefined, 'payload carries the owner state')

    expect(
      state.pushSubscriptions.map(sub => sub.endpoint),
      'the removed device is gone from the answer',
    ).toEqual([kept])
    expect(state.morningReminderEnabled).toBe(true)
  })

  it('answers the final removal by turning reminders off', async () => {
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('only-device')

    await registerPushSubscription({ endpoint, yoga, userToken })

    const result = await removePushSubscription({ endpoint, yoga, userToken })

    expect(result.data?.removePushSubscription?.me).toMatchObject({
      morningReminderEnabled: false,
      pushSubscriptions: [],
    })
  })

  it('cannot remove another user’s subscription', async () => {
    const { userToken: ownerToken } = await createTestUser()
    const { userToken: otherToken } = await createTestUser()
    const endpoint = pushEndpointFor('owned')

    await registerPushSubscription({ endpoint, yoga, userToken: ownerToken })

    const result = await removePushSubscription({
      endpoint,
      yoga,
      userToken: otherToken,
    })

    expect(result.errors?.[0].message).toBe('Push subscription not found')
    expect(await countRows('push_subscriptions')).toBe(1)

    const owner = await mePushState(ownerToken)
    expect(owner.data?.me.pushSubscriptions).toHaveLength(1)
  })
})

describe('sendTestPush', () => {
  it('delivers only to the requested endpoint with the fixed payload', async () => {
    const pushSender = createFakePushSender()
    const { yoga: app } = await createTestApp({ pushSender })
    const { userToken } = await createTestUser()

    const target = pushEndpointFor('target')
    const other = pushEndpointFor('other')
    await registerPushSubscription({ endpoint: target, yoga: app, userToken })
    await registerPushSubscription({ endpoint: other, yoga: app, userToken })

    const result = await sendTestPush({
      endpoint: target,
      yoga: app,
      userToken,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.sendTestPush?.delivered).toBe(true)

    expect(pushSender.sends).toHaveLength(1)
    expect(pushSender.sends[0].endpoint).toBe(target)
    expect(pushSender.sends[0].payload).toEqual({
      title: NOTIFICATION_TITLE,
      body: NOTIFICATION_BODY,
      tag: NOTIFICATION_TAG,
      url: expect.stringMatching(/^\/\?date=\d{4}-\d{2}-\d{2}$/),
    })
  })

  it('cannot test-send to another user’s endpoint', async () => {
    const pushSender = createFakePushSender()
    const { yoga: app } = await createTestApp({ pushSender })
    const { userToken: ownerToken } = await createTestUser()
    const { userToken: otherToken } = await createTestUser()
    const endpoint = pushEndpointFor('private')

    await registerPushSubscription({
      endpoint,
      yoga: app,
      userToken: ownerToken,
    })

    const result = await sendTestPush({
      endpoint,
      yoga: app,
      userToken: otherToken,
    })

    expect(result.errors?.[0].message).toBe('Push subscription not found')
    expect(pushSender.sends).toHaveLength(0)
  })

  it('prunes a subscription the push service reports as gone', async () => {
    const pushSender = createFakePushSender()
    const { yoga: app } = await createTestApp({ pushSender })
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('gone')

    const registered = await registerPushSubscription({
      endpoint,
      yoga: app,
      userToken,
    })
    const globalId =
      registered.data?.registerPushSubscription?.pushSubscription.id
    assert(globalId !== undefined, 'subscription was registered')
    pushSender.setResult(endpoint, 'expired')

    const result = await sendTestPush({ endpoint, yoga: app, userToken })

    expect(result.errors).toBeUndefined()
    expect(result.data?.sendTestPush?.delivered).toBe(false)
    expect(result.data?.sendTestPush?.message).toBe(
      'This subscription is no longer valid and has been removed',
    )
    expect(
      result.data?.sendTestPush?.deletedId,
      'the pruned subscription is identified for the client store',
    ).toBe(globalId)
    expect(result.data?.sendTestPush?.me).toMatchObject({
      morningReminderEnabled: false,
      pushSubscriptions: [],
    })
    expect(await countRows('push_subscriptions')).toBe(0)
  })

  it('reports failure instead of delivering when VAPID is not configured', async () => {
    const { yoga: unconfiguredApp } = await createTestApp()
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('unconfigured')

    await registerPushSubscription({
      endpoint,
      yoga: unconfiguredApp,
      userToken,
    })

    const result = await sendTestPush({
      endpoint,
      yoga: unconfiguredApp,
      userToken,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.sendTestPush?.delivered).toBe(false)
    expect(result.data?.sendTestPush?.message).toBe(
      'Push notifications are not configured on this server',
    )
  })

  it('keeps upstream failure text out of the client response', async () => {
    const pushSender = createFakePushSender()
    const { yoga: app } = await createTestApp({ pushSender })
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('refused')

    await registerPushSubscription({ endpoint, yoga: app, userToken })
    pushSender.setResult(endpoint, {
      failed: 'connect ECONNREFUSED 127.0.0.1:9',
    })

    const logError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      const result = await sendTestPush({ endpoint, yoga: app, userToken })

      expect(result.errors).toBeUndefined()
      expect(result.data?.sendTestPush?.delivered).toBe(false)
      expect(result.data?.sendTestPush?.message).toBe(
        'The test notification could not be delivered',
      )
      expect(JSON.stringify(result)).not.toContain('ECONNREFUSED')
      expect(JSON.stringify(result)).not.toContain('127.0.0.1')

      expect(
        logError.mock.calls.flat().join(' '),
        'the real error is logged for operators',
      ).toContain('connect ECONNREFUSED 127.0.0.1:9')
    } finally {
      logError.mockRestore()
    }
  })

  it('throttles repeated test sends per user', async () => {
    const pushSender = createFakePushSender()
    const { yoga: app } = await createTestApp({ pushSender })
    const { userToken } = await createTestUser()
    const endpoint = pushEndpointFor('throttled')

    await registerPushSubscription({ endpoint, yoga: app, userToken })

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const allowed = await sendTestPush({ endpoint, yoga: app, userToken })
      expect(allowed.errors, `attempt ${attempt}`).toBeUndefined()
    }

    const blocked = await sendTestPush({ endpoint, yoga: app, userToken })

    expect(blocked.data?.sendTestPush).toBeNull()
    expect(blocked.errors?.[0].extensions?.code).toBe('TOO_MANY_REQUESTS')
    expect(pushSender.sends).toHaveLength(5)

    const otherUser = await createTestUser()
    const untouched = await sendTestPush({
      endpoint,
      yoga: app,
      userToken: otherUser.userToken,
    })
    expect(
      untouched.errors?.[0].message,
      'another user is not rate limited by this one',
    ).toBe('Push subscription not found')

    testPushRateLimiter.reset()
    const afterReset = await sendTestPush({ endpoint, yoga: app, userToken })
    expect(afterReset.errors).toBeUndefined()
  })
})

describe('GET /api/push/public-key', () => {
  const originalPublicKey = process.env.VAPID_PUBLIC_KEY

  beforeEach(() => {
    delete process.env.VAPID_PUBLIC_KEY
  })

  afterAll(() => {
    if (originalPublicKey === undefined) {
      delete process.env.VAPID_PUBLIC_KEY
    } else {
      process.env.VAPID_PUBLIC_KEY = originalPublicKey
    }
  })

  it('returns the configured VAPID public key', async () => {
    process.env.VAPID_PUBLIC_KEY = 'BTestVapidPublicKey'
    const { app } = await createTestApp()

    const response = await app.inject({
      method: 'GET',
      url: '/api/push/public-key',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ publicKey: 'BTestVapidPublicKey' })
  })

  it('returns 503 when VAPID is not configured', async () => {
    const { app } = await createTestApp()

    const response = await app.inject({
      method: 'GET',
      url: '/api/push/public-key',
    })

    expect(response.statusCode).toBe(503)
  })
})
