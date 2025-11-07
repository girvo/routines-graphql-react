import type { Kysely } from 'kysely'
import type { Database } from '../database/types.ts'

export interface RefreshTokenRow {
  id: number
  user_id: number
  token_hash: string
  expires_at: string
  created_at: string
  revoked_at: string | null
  user_agent: string | null
  ip_address: string | null
}

export const createRefreshTokenRepository = (db: Kysely<Database>) => {
  return {
    async findById(id: number): Promise<RefreshTokenRow> {
      console.debug(`Looking for refresh token with id ${id}`)
      return db
        .selectFrom('refresh_tokens')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
    },

    async findAllByIds(ids: readonly number[]): Promise<RefreshTokenRow[]> {
      return db.selectFrom('refresh_tokens').selectAll().where('id', 'in', ids).execute()
    },

    async findByTokenHash(tokenHash: string): Promise<RefreshTokenRow | undefined> {
      return db
        .selectFrom('refresh_tokens')
        .selectAll()
        .where('token_hash', '=', tokenHash)
        .executeTakeFirst()
    },

    async findByUserId(userId: number): Promise<RefreshTokenRow[]> {
      return db
        .selectFrom('refresh_tokens')
        .selectAll()
        .where('user_id', '=', userId)
        .where('revoked_at', 'is', null)
        .where('expires_at', '>', new Date().toISOString())
        .execute()
    },

    async createRefreshToken(
      userId: number,
      tokenHash: string,
      expiresAt: string,
      userAgent?: string,
      ipAddress?: string
    ): Promise<RefreshTokenRow> {
      return db
        .insertInto('refresh_tokens')
        .values({
          user_id: userId,
          token_hash: tokenHash,
          expires_at: expiresAt,
          user_agent: userAgent ?? null,
          ip_address: ipAddress ?? null,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async revokeToken(id: number): Promise<void> {
      await db
        .updateTable('refresh_tokens')
        .set({ revoked_at: new Date().toISOString() })
        .where('id', '=', id)
        .execute()
    },

    async revokeAllUserTokens(userId: number): Promise<void> {
      await db
        .updateTable('refresh_tokens')
        .set({ revoked_at: new Date().toISOString() })
        .where('user_id', '=', userId)
        .where('revoked_at', 'is', null)
        .execute()
    },
  }
}
