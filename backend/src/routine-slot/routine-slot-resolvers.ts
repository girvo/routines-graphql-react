import { GraphQLError } from 'graphql'
import type { Context } from '../graphql/context.ts'
import type { NodeLoader } from '../graphql/types.ts'
import type { RoutineSlotResolvers } from '../graphql/resolver-types.ts'

export const resolveRoutineTaskAsNode: NodeLoader<
  'RoutineSlot',
  number
> = async (id, context) => {
  const routineSlot = await context.routineSlots.load(id)

  if (!routineSlot) {
    return null
  }

  return routineSlot
}

export const task: RoutineSlotResolvers<Context>['task'] = async (
  parent,
  _args,
  context,
) => {
  const task = await context.tasks.load(parent.taskId)
  if (!task) {
    throw new GraphQLError('Task not found')
  }

  return task
}
