import type { JWTExtendContextFields } from '@graphql-yoga/plugin-jwt'
import { db } from '../database/index.ts'
import { getEnv } from '../env.ts'
import type { YogaInitialContext } from 'graphql-yoga'
import { createUserRepository } from '../user/user-repository.ts'
import type { UserDomain } from '../user/user-domain.ts'
import type { UserDataLoader } from '../user/user-loaders.ts'

export const userRepo = createUserRepository(db)

export function createContext(initialContext: YogaInitialContext) {
  return {
    ...initialContext,
    env: getEnv(),
    db,
    userRepo,
  }
}

export type BaseContext = ReturnType<typeof createContext>
export type Context = BaseContext & { jwt?: JWTExtendContextFields } & {
  currentUser: UserDomain | null
} & {
  users: UserDataLoader
}
