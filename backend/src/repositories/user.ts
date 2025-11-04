import type { Kysely } from 'kysely'
import type { Database } from '../database/types.ts'

export const createUserRepository = (db: Kysely<Database>) => {
  return {
    async findByEmail(email: string) {
      return db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirstOrThrow()
    },
  }
}
