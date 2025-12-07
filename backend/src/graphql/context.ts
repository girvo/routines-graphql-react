import type { JWTExtendContextFields } from '@graphql-yoga/plugin-jwt'
import { getEnv } from '../env.ts'
import type { YogaInitialContext } from 'graphql-yoga'
import { createUserRepository } from '../user/user-repository.ts'
import type { UserDomain } from '../user/user-domain.ts'
import type { UserDataLoader } from '../user/user-loaders.ts'
import { createTaskRepository } from '../task/task-repository.ts'
import type { TaskDataLoader } from '../task/task-loaders.ts'
import type { RoutineSlotDataLoader } from '../routine-slot/routine-slot-loaders.ts'
import { createRoutineSlotRepository } from '../routine-slot/routine-slot-repository.ts'
import type { TaskCompletionDataLoader } from '../task-completion/task-completion-loaders.ts'
import { createTaskCompletionRepository } from '../task-completion/task-completion-repository.ts'
import type { Kysely } from 'kysely'
import type { Database } from '../database/types.ts'

export function createContext(
  initialContext: YogaInitialContext,
  db: Kysely<Database>,
) {
  const userRepo = createUserRepository(db)
  const taskRepo = createTaskRepository(db)
  const routineRepo = createRoutineSlotRepository(db)
  const taskCompletionRepo = createTaskCompletionRepository(db)

  return {
    ...initialContext,
    env: getEnv(),
    db,
    userRepo,
    taskRepo,
    routineRepo,
    taskCompletionRepo,
  }
}

export type BaseContext = ReturnType<typeof createContext>
export type Context = BaseContext & { jwt?: JWTExtendContextFields } & {
  currentUser: UserDomain | null
} & {
  users: UserDataLoader
  tasks: TaskDataLoader
  routineSlots: RoutineSlotDataLoader
  taskCompletions: TaskCompletionDataLoader
}

// Used so we can stop having to write this over and over...
export type AuthenticatedContext = Omit<Context, 'currentUser'> & {
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
