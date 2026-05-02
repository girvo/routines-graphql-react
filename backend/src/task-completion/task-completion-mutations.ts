import {
  tableToDomain,
  buildTaskCompletionEdge,
  taskCompletionToGraphQL,
} from './task-completion-domain.ts'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { fromGlobalId } from '../globalId.ts'
import { GraphQLError } from 'graphql'
import { tableToDomain as routineSlotTableToDomain } from '../routine-slot/routine-slot-domain.ts'
import { dailyTaskInstanceToGraphQL } from '../schedule/schedule-domain.ts'

export const completeRoutineSlot: MutationResolvers<Context>['completeRoutineSlot'] =
  async (_parent, { routineSlotId }, context) => {
    assertAuthenticated(context)

    const decodedRoutineSlotId = fromGlobalId(routineSlotId, 'RoutineSlot')

    const routineSlotRow = await context.routineRepo.findByIdAndUserId(
      decodedRoutineSlotId,
      context.currentUser.id,
    )
    if (!routineSlotRow) {
      throw new GraphQLError('Routine slot not found')
    }

    const completionRow = await context.taskCompletionRepo.createCompletion(
      context.currentUser.id,
      decodedRoutineSlotId,
    )

    const completion = tableToDomain(completionRow)
    const completionEdge = buildTaskCompletionEdge(completion)
    const routineSlot = routineSlotTableToDomain(routineSlotRow)

    return {
      dailyTaskInstance: dailyTaskInstanceToGraphQL({
        date: completion.completedAt,
        routineSlot,
        completion,
      }),
      taskCompletionEdge: {
        node: taskCompletionToGraphQL(completionEdge.node),
        cursor: completionEdge.cursor,
      },
    }
  }

export const uncompleteRoutineSlot: MutationResolvers<Context>['uncompleteRoutineSlot'] =
  async (_parent, { taskCompletionId }, context) => {
    assertAuthenticated(context)

    const id = fromGlobalId(taskCompletionId, 'TaskCompletion')

    const existingRow = await context.taskCompletionRepo.findByIdAndUserId(
      id,
      context.currentUser.id,
    )
    if (!existingRow) {
      throw new GraphQLError("Task completion didn't exist")
    }
    const existing = tableToDomain(existingRow)

    const routineSlotRow = await context.routineRepo.findByIdAndUserId(
      existing.routineSlotId,
      context.currentUser.id,
    )
    if (!routineSlotRow) {
      throw new GraphQLError('Routine slot not found')
    }

    const res = await context.taskCompletionRepo.deleteCompletion(
      id,
      context.currentUser.id,
    )

    if (res.numDeletedRows < 1) {
      throw new GraphQLError("Task completion didn't exist")
    }

    return {
      dailyTaskInstance: dailyTaskInstanceToGraphQL({
        date: existing.completedAt,
        routineSlot: routineSlotTableToDomain(routineSlotRow),
        completion: null,
      }),
      deletedId: taskCompletionId,
    }
  }
