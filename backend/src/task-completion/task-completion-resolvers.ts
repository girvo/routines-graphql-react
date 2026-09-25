import { buildTaskCompletionConnection } from './task-completion-domain.ts'
import type { NodeLoader } from '../graphql/types.ts'
import type { TaskCompletionResolvers } from '../graphql/resolver-types.ts'
import type { QueryResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { GraphQLError } from 'graphql'

export const taskCompletions: QueryResolvers<Context>['taskCompletions'] =
  async (_parent, { first, after, startDate, endDate }, context) => {
    assertAuthenticated(context)
    const take = first ?? 10

    const completions = await context.taskCompletionRepo.findByUserIdPaginated(
      context.currentUser.id,
      { first: take, after },
      { startDate: startDate ?? undefined, endDate: endDate ?? undefined },
    )

    const connection = buildTaskCompletionConnection(completions, take)
    connection.edges.forEach(({ node }) =>
      context.taskCompletions.prime(node.id, node),
    )

    return {
      edges: connection.edges,
      pageInfo: connection.pageInfo,
    }
  }

export const resolveTaskCompletionAsNode: NodeLoader<
  'TaskCompletion',
  number
> = async (id, context) => {
  const taskCompletion = await context.taskCompletions.load(id)

  if (!taskCompletion) {
    return null
  }

  return taskCompletion
}

export const routineSlot: TaskCompletionResolvers<Context>['routineSlot'] =
  async (parent, _args, context) => {
    const routineSlot = await context.routineSlots.load(parent.routineSlotId)
    if (!routineSlot) {
      throw new GraphQLError('Routine slot not found')
    }

    return routineSlot
  }

export const dailyTaskInstance: TaskCompletionResolvers<Context>['dailyTaskInstance'] =
  async (parent, _args, context) => {
    const slot = await context.routineSlots.load(parent.routineSlotId)
    if (!slot) {
      throw new GraphQLError('Routine slot not found')
    }

    return { date: parent.completedAt, routineSlot: slot, completion: parent }
  }
