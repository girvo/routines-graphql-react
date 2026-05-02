import {
  buildTaskCompletionConnection,
  taskCompletionToGraphQL,
} from './task-completion-domain.ts'
import type { NodeResolver } from '../graphql/types.ts'
import type { TaskCompletionResolvers } from '../graphql/resolver-types.ts'
import type { QueryResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { GraphQLError } from 'graphql'
import { routineSlotToGraphQL } from '../routine-slot/routine-slot-domain.ts'
import { fromGlobalId } from '../globalId.ts'
import { encodeDailyTaskInstanceId } from '../schedule/schedule-domain.ts'

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
      edges: connection.edges.map(edge => ({
        node: taskCompletionToGraphQL(edge.node),
        cursor: edge.cursor,
      })),
      pageInfo: connection.pageInfo,
    }
  }

export const resolveTaskCompletionAsNode: NodeResolver<
  'TaskCompletion'
> = async (id, context) => {
  const taskCompletion = await context.taskCompletions.load(id)

  if (!taskCompletion || taskCompletion instanceof Error) {
    return null
  }

  return taskCompletionToGraphQL(taskCompletion)
}

export const routineSlot: TaskCompletionResolvers<Context>['routineSlot'] =
  async (parent, _args, context) => {
    const routineSlot = await context.routineSlots.load(
      fromGlobalId(parent.routineSlot.id, 'RoutineSlot'),
    )
    if (!routineSlot) {
      throw new GraphQLError('Routine slot not found')
    }

    return routineSlotToGraphQL(routineSlot)
  }

export const dailyTaskInstance: TaskCompletionResolvers<
  Context
>['dailyTaskInstance'] = async (parent, _args, context) => {
  const slotId = fromGlobalId(parent.routineSlot.id, 'RoutineSlot')
  const slot = await context.routineSlots.load(slotId)
  if (!slot) {
    throw new GraphQLError('Routine slot not found')
  }

  return {
    __typename: 'DailyTaskInstance' as const,
    id: encodeDailyTaskInstanceId(slotId, parent.completedAt),
    routineSlot: routineSlotToGraphQL(slot),
    completion: parent,
  }
}
