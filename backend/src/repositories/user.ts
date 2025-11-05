import type { Kysely } from 'kysely'
import type { Database } from '../database/types.ts'

export interface UserRow {
  id: number
  email: string
  password_hash: string
  created_at: string
  updated_at: string | null
  last_logged_in: string | null
}

export const createUserRepository = (db: Kysely<Database>) => {
  return {
    async findById(id: number): Promise<UserRow> {
      return db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
    },

    async findByEmail(email: string): Promise<UserRow> {
      return db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirstOrThrow()
    },

    async createUser(email: string, passwordHash: string): Promise<UserRow> {
      return db
        .insertInto('users')
        .values({
          email: email,
          password_hash: passwordHash,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },
  }
}
