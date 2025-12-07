import {
  tableToDomain,
  buildTaskCompletionEdge,
} from './task-completion-domain.ts'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { fromGlobalId } from '../globalId.ts'
import { GraphQLError } from 'graphql'

export const completeRoutineSlot: MutationResolvers<Context>['completeRoutineSlot'] =
  async (_parent, { routineSlotId }, context) => {
    assertAuthenticated(context)

    const completionRow = await context.taskCompletionRepo.createCompletion(
      context.currentUser.id,
      fromGlobalId(routineSlotId, 'RoutineSlot'),
    )

    const completion = tableToDomain(completionRow)

    return {
      taskCompletionEdge: buildTaskCompletionEdge(completion),
    }
  }

export const uncompleteRoutineSlot: MutationResolvers<Context>['uncompleteRoutineSlot'] =
  async (_parent, { taskCompletionId }, context) => {
    assertAuthenticated(context)

    const id = fromGlobalId(taskCompletionId, 'TaskCompletion')
    const res = await context.taskCompletionRepo.deleteCompletion(
      id,
      context.currentUser.id,
    )

    if (res.numDeletedRows < 1) {
      throw new GraphQLError("Task completion didn't exist")
    }

    return {
      deletedId: taskCompletionId,
    }
  }
