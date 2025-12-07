import { GraphQLError } from 'graphql'
import type { Context } from '../graphql/context.ts'
import type { RoutineSlotResolvers } from '../graphql/resolver-types.ts'
import { taskToGraphQL } from '../task/task-domain.ts'
import { fromGlobalId } from '../globalId.ts'

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
