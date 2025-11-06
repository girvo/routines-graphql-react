import type { JWTExtendContextFields } from '@graphql-yoga/plugin-jwt'
import { db } from '../database/index.ts'
import { getEnv } from '../env.ts'
import { createUserRepository } from '../repositories/user.ts'
import type { YogaInitialContext } from 'graphql-yoga'
import type { UserDomain } from '../domains/user.ts'
import type { UserDataLoader } from '../loaders/user.ts'

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
