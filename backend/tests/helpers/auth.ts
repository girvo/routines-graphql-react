import type { Kysely } from 'kysely'
import type { Database } from '../../src/database/types.ts'
import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import { env } from 'process'
import { createAccessToken } from '../../src/auth/auth-utils.ts'
import { createUserRepository } from '../../src/user/user-repository.ts'

export const createTestUser = async (db: Kysely<Database>) => {
  const userRepo = createUserRepository(db)
  const passHash = await hash(randomBytes(32).toString('base64'), 10)
  const user = await userRepo.createUser('test@example.com', passHash)
  const token = createAccessToken(user.id, env.JWT_SECRET as any)

  return token
}
