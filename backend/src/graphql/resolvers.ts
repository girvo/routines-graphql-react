import type { Resolvers, Scalars } from './resolver-types.ts'
import type { Context } from './context.ts'
import type { NodeResolver, NodeType } from './types.ts'
import { DateTimeResolver, NonNegativeIntResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import { decodeGlobalId } from '../globalId.ts'
import { getUser } from '../auth/auth-context.ts'
import { userToGraphQL } from '../user/user-domain.ts'
import * as UserResolvers from '../user/user-resolvers.ts'
import * as TaskResolvers from '../task/task-resolvers.ts'
import * as TaskMutations from '../task/task-mutations.ts'
import * as RoutineSlotResolvers from '../routine-slot/routine-slot-resolvers.ts'
import * as RoutineSlotMutations from '../routine-slot/routine-slot-mutations.ts'
import * as TaskCompletionResolvers from '../task-completion/task-completion-resolvers.ts'
import * as TaskCompletionMutations from '../task-completion/task-completion-mutations.ts'

const nodeResolvers: { [NodeName in NodeType]: NodeResolver<NodeName> } = {
  User: UserResolvers.resolveUserAsNode,
  Task: TaskResolvers.resolveTaskAsNode,
  RoutineSlot: RoutineSlotResolvers.resolveRoutineTaskAsNode,
  TaskCompletion: TaskCompletionResolvers.resolveTaskCompletionAsNode,
}

export const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return 'world'
    },
    me: async (_, {}, context) => {
      const user = await getUser(context)
      return userToGraphQL(user)
    },
    node: async (_, { id }, context) => {
      let type: string
      let internalId: number

      try {
        const decoded = decodeGlobalId(id)
        type = decoded.type
        internalId = decoded.id
      } catch (error) {
        throw new GraphQLError('Invalid node ID', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const adapter = nodeResolvers[type as keyof typeof nodeResolvers]

      if (!adapter) {
        throw new GraphQLError(`Unknown node type: ${type}`, {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      return adapter(internalId, context)
    },
    tasks: TaskResolvers.tasksResolver,
    taskCompletions: TaskCompletionResolvers.taskCompletions,
  },
  Mutation: {
    createTask: TaskMutations.createTask,
    deleteTask: TaskMutations.deleteTask,
    updateTask: TaskMutations.updateTask,
    createRoutineSlot: RoutineSlotMutations.createRoutineSlot,
    deleteRoutineSlot: RoutineSlotMutations.deleteRoutineSlot,
    completeRoutineSlot: TaskCompletionMutations.completeRoutineSlot,
    uncompleteRoutineSlot: TaskCompletionMutations.uncompleteRoutineSlot,
  },
  Task: {
    completions: TaskResolvers.completions,
    slots: TaskResolvers.slots,
  },
  RoutineSlot: {
    task: RoutineSlotResolvers.task,
  },
  TaskCompletion: {
    routineSlot: TaskCompletionResolvers.routineSlot,
  },
  Node: {
    __resolveType: parent => parent.__typename ?? null,
  },
  // Custom scalars
  DateTime: DateTimeResolver,
  NonNegativeInt: NonNegativeIntResolver,
}
