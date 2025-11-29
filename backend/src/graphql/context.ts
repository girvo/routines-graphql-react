import type { JWTExtendContextFields } from '@graphql-yoga/plugin-jwt'
import { db } from '../database/index.ts'
import { getEnv } from '../env.ts'
import type { YogaInitialContext } from 'graphql-yoga'
import { createUserRepository } from '../user/user-repository.ts'
import type { UserDomain } from '../user/user-domain.ts'
import type { UserDataLoader } from '../user/user-loaders.ts'
import { createTaskRepository } from '../task/task-repository.ts'
import type { TaskDataLoader } from '../task/task-loaders.ts'

export const userRepo = createUserRepository(db)
const taskRepo = createTaskRepository(db)

export function createContext(initialContext: YogaInitialContext) {
  return {
    ...initialContext,
    env: getEnv(),
    db,
    userRepo,
    taskRepo,
  }
}

export type BaseContext = ReturnType<typeof createContext>
export type Context = BaseContext & { jwt?: JWTExtendContextFields } & {
  currentUser: UserDomain | null
} & {
  users: UserDataLoader
  tasks: TaskDataLoader
}

// Used so we can stop having to write this over and over...
type AuthenticatedContext = Omit<Context, 'currentUser'> & {
  currentUser: UserDomain
}

// This should live somewhere else, but it'll do for now
export function assertAuthenticated(
  context: Context,
): asserts context is AuthenticatedContext {
  if (!context.currentUser) {
    throw new Error('User must be authenticated')
  }
}
