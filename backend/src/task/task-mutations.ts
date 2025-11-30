import { tableToDomain, taskToGraphQL } from './task-domain.ts'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { taskCursor } from './task-repository.ts'
import { fromGlobalId } from '../globalId.ts'

export const createTask: MutationResolvers<Context>['createTask'] = async (
  _parent,
  { title },
  context,
) => {
  assertAuthenticated(context)

  const taskRow = await context.taskRepo.createTask(
    title,
    context.currentUser.id,
  )
  const task = tableToDomain(taskRow)
  context.tasks.prime(task.id, task)

  return {
    taskEdge: {
      node: taskToGraphQL(task),
      cursor: taskCursor.encode({
        createdAt: task.createdAt.toISOString(),
        id: task.id,
      }),
    },
  }
}

export const deleteTask: MutationResolvers<Context>['deleteTask'] = async (
  _parent,
  { id },
  context,
) => {
  assertAuthenticated(context)

  await context.taskRepo.deleteTask(fromGlobalId(id, 'Task'))

  return {
    deletedId: id,
  }
}
