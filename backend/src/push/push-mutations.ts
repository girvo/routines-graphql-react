import { GraphQLError } from 'graphql'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { toGlobalId } from '../globalId.ts'
import { getUserDayKey } from '../user-timezone.ts'
import { tableToDomain } from './push-domain.ts'
import { buildMorningReminderPayload } from './push-payload.ts'
import { assertPublicPushEndpoint } from './endpoint-policy.ts'
import { testPushRateLimiter } from './rate-limit.ts'

const notFound = () =>
  new GraphQLError('Push subscription not found', {
    extensions: { code: 'NOT_FOUND' },
  })

const tooManyRequests = (retryAfterSeconds: number) =>
  new GraphQLError(
    `Too many test notifications. Try again in ${retryAfterSeconds} seconds.`,
    { extensions: { code: 'TOO_MANY_REQUESTS' } },
  )

/**
 * Only used where we already hold the endpoint in the database: a subscription
 * registered before the endpoint policy was tightened must still be removable,
 * so removal does not re-run the reachability policy.
 */
const normalizeStoredEndpoint = (endpoint: string): string => {
  try {
    return new URL(endpoint).toString()
  } catch {
    throw new GraphQLError('Push subscription endpoint must be a valid URL', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }
}

const assertPublicEndpoint = async (
  endpoint: string,
  context: Context,
): Promise<string> => {
  const normalized = normalizeStoredEndpoint(endpoint)

  return assertPublicPushEndpoint(normalized, context.resolvePushHost)
}

const assertValidKeys = (keys: { p256dh: string; auth: string }) => {
  if (!keys.p256dh.trim() || !keys.auth.trim()) {
    throw new GraphQLError(
      'Push subscription keys must include p256dh and auth',
      { extensions: { code: 'BAD_USER_INPUT' } },
    )
  }

  return { p256dh: keys.p256dh.trim(), auth: keys.auth.trim() }
}

/**
 * Every push mutation answers with the owner's derived reminders state, so the
 * client renders what this server actually stored rather than guessing that a
 * mutation changed it.
 */
const payloadOwner = (context: Context) => {
  assertAuthenticated(context)

  return context.currentUser
}

export const registerPushSubscription: MutationResolvers<Context>['registerPushSubscription'] =
  async (_parent, { input }, context) => {
    assertAuthenticated(context)

    const userId = context.currentUser.id
    const endpoint = await assertPublicEndpoint(input.endpoint, context)
    const keys = assertValidKeys(input.keys)

    // Endpoints are globally unique, so this guards against one device
    // re-registering (and thereby rewriting) somebody else's subscription.
    const existing = await context.pushRepo.findByEndpoint(endpoint)
    if (existing && existing.user_id !== userId) {
      throw new GraphQLError('Push subscription belongs to another user', {
        extensions: { code: 'FORBIDDEN' },
      })
    }

    const row = await context.pushRepo.upsertSubscription({
      userId,
      endpoint,
      p256dhKey: keys.p256dh,
      authKey: keys.auth,
      platform: input.platform?.trim() ? input.platform.trim() : null,
      userAgent: context.request.headers.get('user-agent'),
    })

    return {
      pushSubscription: tableToDomain(row),
      me: payloadOwner(context),
    }
  }

export const removePushSubscription: MutationResolvers<Context>['removePushSubscription'] =
  async (_parent, { endpoint }, context) => {
    assertAuthenticated(context)

    const userId = context.currentUser.id
    const normalized = normalizeStoredEndpoint(endpoint)

    const existing = await context.pushRepo.findByEndpointAndUserId(
      normalized,
      userId,
    )
    if (!existing) {
      throw notFound()
    }

    await context.pushRepo.deleteByEndpointAndUserId(normalized, userId)

    return {
      deletedId: toGlobalId('PushSubscription', existing.id),
      me: payloadOwner(context),
    }
  }

export const sendTestPush: MutationResolvers<Context>['sendTestPush'] = async (
  _parent,
  { endpoint },
  context,
) => {
  assertAuthenticated(context)

  const userId = context.currentUser.id
  const rateLimit = testPushRateLimiter.check(`sendTestPush:${userId}`)
  if (!rateLimit.allowed) {
    throw tooManyRequests(rateLimit.retryAfterSeconds)
  }

  const normalized = await assertPublicEndpoint(endpoint, context)

  const existing = await context.pushRepo.findByEndpointAndUserId(
    normalized,
    userId,
  )
  if (!existing) {
    throw notFound()
  }

  if (!context.pushSender) {
    return {
      delivered: false,
      message: 'Push notifications are not configured on this server',
      deletedId: null,
      me: payloadOwner(context),
    }
  }

  const result = await context.pushSender.send(
    {
      endpoint: existing.endpoint,
      p256dhKey: existing.p256dh_key,
      authKey: existing.auth_key,
    },
    buildMorningReminderPayload(getUserDayKey(new Date())),
  )

  if (result !== 'sent' && result !== 'expired') {
    // `result.failed` routinely contains the upstream body, which can name an
    // internal host or port. It belongs in the log, not in a client-visible
    // GraphQL field.
    console.error(
      `sendTestPush delivery failed for user ${userId}: ${result.failed}`,
    )
  }

  if (result === 'sent') {
    return {
      delivered: true,
      message: 'Test notification sent',
      deletedId: null,
      me: payloadOwner(context),
    }
  }

  if (result === 'expired') {
    await context.pushRepo.deleteById(existing.id)
    return {
      delivered: false,
      message: 'This subscription is no longer valid and has been removed',
      deletedId: toGlobalId('PushSubscription', existing.id),
      me: payloadOwner(context),
    }
  }

  return {
    delivered: false,
    message: 'The test notification could not be delivered',
    deletedId: null,
    me: payloadOwner(context),
  }
}
