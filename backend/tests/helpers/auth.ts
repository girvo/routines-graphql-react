import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import { env } from 'process'
import { createAccessToken } from '../../src/auth/auth-utils.ts'
import { createUserRepository } from '../../src/user/user-repository.ts'
import { db } from '../../src/database/index.ts'
import { toGlobalId } from '../../src/globalId.ts'

interface CreateTestUserOptions {
  email?: string
  name?: string
}

export const createTestUser = async (options: CreateTestUserOptions = {}) => {
  const userRepo = createUserRepository(db)
  const email = options.email ?? `test-${randomBytes(8).toString('hex')}@example.com`
  const name = options.name ?? 'Test User'
  const passHash = await hash(randomBytes(32).toString('base64'), 10)
  const user = await userRepo.createUser(email, name, passHash)
  const userToken = createAccessToken(user.id, env.JWT_SECRET as any)

  return {
    userToken,
    numericId: user.id,
    globalId: toGlobalId('User', user.id),
  }
}
