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
  { taskId },
  context,
) => {
  assertAuthenticated(context)

  await context.taskRepo.deleteTask(fromGlobalId(taskId, 'Task'))

  return {
    deletedId: taskId,
  }
}

export const updateTask: MutationResolvers<Context>['updateTask'] = async (
  _parent,
  { input },
  context,
) => {
  assertAuthenticated(context)

  const updatedTaskRow = await context.taskRepo.updateTask(
    fromGlobalId(input.taskId, 'Task'),
    input.title,
    context.currentUser.id,
  )
  const updatedTask = tableToDomain(updatedTaskRow)
  context.tasks.prime(updatedTask.id, updatedTask)

  return {
    task: taskToGraphQL(updatedTask),
  }
}
