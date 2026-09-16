import type { Kysely, DeleteResult } from 'kysely'
import type { Database } from '../database/types.ts'
import { getCurrentTimestamp } from '../database/time.ts'

export interface PushSubscriptionRow {
  id: number
  user_id: number
  endpoint: string
  p256dh_key: string
  auth_key: string
  platform: string | null
  user_agent: string | null
  created_at: string
  last_seen_at: string | null
}

export interface UpsertPushSubscriptionInput {
  userId: number
  endpoint: string
  p256dhKey: string
  authKey: string
  platform: string | null
  userAgent?: string | null
}

export const createPushSubscriptionRepository = (db: Kysely<Database>) => {
  return {
    async upsertSubscription(
      input: UpsertPushSubscriptionInput,
    ): Promise<PushSubscriptionRow> {
      const now = getCurrentTimestamp()

      return db
        .insertInto('push_subscriptions')
        .values({
          user_id: input.userId,
          endpoint: input.endpoint,
          p256dh_key: input.p256dhKey,
          auth_key: input.authKey,
          platform: input.platform,
          user_agent: input.userAgent ?? null,
          created_at: now,
          last_seen_at: now,
        })
        .onConflict(oc =>
          oc.column('endpoint').doUpdateSet({
            p256dh_key: input.p256dhKey,
            auth_key: input.authKey,
            platform: input.platform,
            user_agent: input.userAgent ?? null,
            last_seen_at: now,
          }),
        )
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async findByIdAndUserId(
      id: number,
      userId: number,
    ): Promise<PushSubscriptionRow | undefined> {
      return db
        .selectFrom('push_subscriptions')
        .selectAll()
        .where('id', '=', id)
        .where('user_id', '=', userId)
        .executeTakeFirst()
    },

    async findByEndpoint(
      endpoint: string,
    ): Promise<PushSubscriptionRow | undefined> {
      return db
        .selectFrom('push_subscriptions')
        .selectAll()
        .where('endpoint', '=', endpoint)
        .executeTakeFirst()
    },

    async findByEndpointAndUserId(
      endpoint: string,
      userId: number,
    ): Promise<PushSubscriptionRow | undefined> {
      return db
        .selectFrom('push_subscriptions')
        .selectAll()
        .where('endpoint', '=', endpoint)
        .where('user_id', '=', userId)
        .executeTakeFirst()
    },

    async findByUserId(userId: number): Promise<PushSubscriptionRow[]> {
      return db
        .selectFrom('push_subscriptions')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('created_at', 'asc')
        .orderBy('id', 'asc')
        .execute()
    },

    async deleteByEndpointAndUserId(
      endpoint: string,
      userId: number,
    ): Promise<DeleteResult> {
      return db
        .deleteFrom('push_subscriptions')
        .where('endpoint', '=', endpoint)
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()
    },

    async deleteById(id: number): Promise<DeleteResult> {
      return db
        .deleteFrom('push_subscriptions')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
    },
  }
}

export type PushSubscriptionRepository = ReturnType<
  typeof createPushSubscriptionRepository
>
