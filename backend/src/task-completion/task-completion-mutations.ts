import {
  tableToDomain,
  buildTaskCompletionEdge,
  taskCompletionToGraphQL,
} from './task-completion-domain.ts'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { GraphQLError } from 'graphql'
import { tableToDomain as routineSlotTableToDomain } from '../routine-slot/routine-slot-domain.ts'
import {
  decodeDailyTaskInstanceId,
  dailyTaskInstanceToGraphQL,
} from '../schedule/schedule-domain.ts'
import { toGlobalId } from '../globalId.ts'

export const completeRoutineSlot: MutationResolvers<Context>['completeRoutineSlot'] =
  async (_parent, { dailyTaskInstanceId }, context) => {
    assertAuthenticated(context)

    const { date, routineSlotId } = decodeDailyTaskInstanceId(
      dailyTaskInstanceId,
    )

    const routineSlot = await context.routineRepo.findByIdAndUserId(
      routineSlotId,
      context.currentUser.id,
    )
    if (!routineSlot) {
      throw new GraphQLError('Routine slot not found')
    }

    const completionRow = await context.taskCompletionRepo.createCompletion(
      context.currentUser.id,
      routineSlotId,
      date.toISOString(),
    )

    const completion = tableToDomain(completionRow)
    const completionEdge = buildTaskCompletionEdge(completion)

    return {
      taskCompletionEdge: {
        node: taskCompletionToGraphQL(completionEdge.node),
        cursor: completionEdge.cursor,
      },
    }
  }

export const uncompleteRoutineSlot: MutationResolvers<Context>['uncompleteRoutineSlot'] =
  async (_parent, { dailyTaskInstanceId }, context) => {
    assertAuthenticated(context)

    const { date, routineSlotId } = decodeDailyTaskInstanceId(
      dailyTaskInstanceId,
    )

    const routineSlotRow = await context.routineRepo.findByIdAndUserId(
      routineSlotId,
      context.currentUser.id,
    )
    if (!routineSlotRow) {
      throw new GraphQLError('Routine slot not found')
    }

    const existingRow = await context.taskCompletionRepo.findBySlotAndDate(
      routineSlotId,
      context.currentUser.id,
      date,
    )
    if (!existingRow) {
      throw new GraphQLError("Task completion didn't exist")
    }

    const res = await context.taskCompletionRepo.deleteCompletion(
      existingRow.id,
      context.currentUser.id,
    )

    if (res.numDeletedRows < 1) {
      throw new GraphQLError("Task completion didn't exist")
    }

    return {
      dailyTaskInstance: dailyTaskInstanceToGraphQL({
        date,
        routineSlot: routineSlotTableToDomain(routineSlotRow),
        completion: null,
      }),
      deletedId: toGlobalId('TaskCompletion', existingRow.id),
    }
  }
