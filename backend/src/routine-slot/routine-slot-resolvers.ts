import { GraphQLError } from 'graphql'
import type { Context } from '../graphql/context.ts'
import type { NodeResolver } from '../graphql/types.ts'
import type { RoutineSlotResolvers } from '../graphql/resolver-types.ts'
import { fromGlobalId } from '../globalId.ts'
import { routineSlotToGraphQL } from './routine-slot-domain.ts'
import { taskToGraphQL } from '../task/task-domain.ts'

export const resolveRoutineTaskAsNode: NodeResolver<'RoutineSlot'> = async (
  id,
  context,
) => {
  const routineSlot = await context.routineSlots.load(id)

  if (!routineSlot || routineSlot instanceof Error) {
    return null
  }

  return routineSlotToGraphQL(routineSlot)
}

export const task: RoutineSlotResolvers<Context>['task'] = async (
  parent,
  _args,
  context,
) => {
  const task = await context.tasks.load(fromGlobalId(parent.task.id, 'Task'))
  if (!task) {
    throw new GraphQLError('Task not found') // TBD: fix this
  }

  return taskToGraphQL(task)
}
