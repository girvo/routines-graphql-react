import type { ColumnType, Generated } from 'kysely'

export interface Database {
  users: UsersTable
  refresh_tokens: RefreshTokensTable
}

export interface UsersTable {
  id: Generated<number>
  email: string
  password_hash: string
  created_at: ColumnType<string, string | undefined, never>
  updated_at: ColumnType<string | null, string | undefined, string>
  last_logged_in: string | null
}

export interface RefreshTokensTable {
  id: Generated<number>
  user_id: number
  token_hash: string
  expires_at: string
  created_at: ColumnType<string, string | undefined, never>
  revoked_at: string | null
  user_agent: string | null
  ip_address: string | null
}
