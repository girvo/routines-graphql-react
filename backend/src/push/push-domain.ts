import { type } from 'arktype'
import { parseISO } from 'date-fns'
import { toGlobalId } from '../globalId.ts'
import type { PushSubscriptionRow } from './push-repository.ts'

const PushSubscriptionDomain = type({
  id: 'number',
  userId: 'number',
  endpoint: 'string',
  p256dhKey: 'string',
  authKey: 'string',
  platform: 'string | null',
  createdAt: 'Date',
  lastSeenAt: 'Date | null',
})

export type PushSubscriptionDomain = typeof PushSubscriptionDomain.infer

export const tableToDomain = (
  input: PushSubscriptionRow,
): PushSubscriptionDomain => {
  return PushSubscriptionDomain.assert({
    id: input.id,
    userId: input.user_id,
    endpoint: input.endpoint,
    p256dhKey: input.p256dh_key,
    authKey: input.auth_key,
    platform: input.platform,
    createdAt: parseISO(input.created_at),
    lastSeenAt: input.last_seen_at ? parseISO(input.last_seen_at) : null,
  })
}

export const pushSubscriptionToGraphQL = (sub: PushSubscriptionDomain) => ({
  __typename: 'PushSubscription' as const,
  id: toGlobalId('PushSubscription', sub.id),
  endpoint: sub.endpoint,
  platform: sub.platform,
  createdAt: sub.createdAt,
  lastSeenAt: sub.lastSeenAt,
})

export type PushSubscriptionNode = ReturnType<typeof pushSubscriptionToGraphQL>
