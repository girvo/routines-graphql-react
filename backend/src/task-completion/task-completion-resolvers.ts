import {
  buildTaskCompletionConnection,
  taskCompletionToGraphQL,
} from './task-completion-domain.ts'
import type { NodeResolver } from '../graphql/types.ts'
import type { TaskCompletionResolvers } from '../graphql/resolver-types.ts'
import type { QueryResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { taskCompletionCursor } from './task-completion-repository.ts'
import { GraphQLError } from 'graphql'
import { routineSlotToGraphQL } from '../routine-slot/routine-slot-domain.ts'
import { fromGlobalId } from '../globalId.ts'

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
