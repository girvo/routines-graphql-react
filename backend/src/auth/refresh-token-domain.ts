import { sqliteDateToDate } from '../database/utils.ts'
import { type } from 'arktype'
import type { RefreshTokenRow } from './refresh-token-repository.ts'

const RefreshTokenDomain = type({
  id: 'number',
  userId: 'number',
  token: 'string',
  expiresAt: 'Date',
  createdAt: 'Date',
  revokedAt: 'Date | null',
  userAgent: 'string | null',
  ipAddress: 'string | null',
})

export type RefreshTokenDomain = typeof RefreshTokenDomain.infer

export const tableToDomain = (input: RefreshTokenRow): RefreshTokenDomain => {
  return RefreshTokenDomain.assert({
    id: input.id,
    userId: input.user_id,
    token: input.token_hash,
    expiresAt: sqliteDateToDate(input.expires_at),
    createdAt: sqliteDateToDate(input.created_at),
    revokedAt: input.revoked_at ? sqliteDateToDate(input.revoked_at) : null,
    userAgent: input.user_agent,
    ipAddress: input.ip_address,
  })
}

export const refreshTokenToGraphQl = (input: RefreshTokenDomain): never => {
  throw new Error('This should never be called')
}
