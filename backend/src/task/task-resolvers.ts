import { buildTaskConnection, taskToGraphQL } from './task-domain.ts'
import type { NodeResolver } from '../graphql/types.ts'
import type {
  QueryResolvers,
  TaskResolvers,
} from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { taskCursor } from './task-repository.ts'
import { fromGlobalId } from '../globalId.ts'
import {
  buildTaskCompletionConnection,
  taskCompletionToGraphQL,
} from '../task-completion/task-completion-domain.ts'

export const resolveTaskAsNode: NodeResolver<'Task'> = async (id, context) => {
  const task = await context.tasks.load(id)

  if (!task || task instanceof Error) {
    return null
  }

  return taskToGraphQL(task)
}

export const tasksResolver: QueryResolvers<Context>['tasks'] = async (
  _parent,
  args,
  context,
) => {
  assertAuthenticated(context)

  const first = args.first ?? 10
  const direction: 'asc' | 'desc' = args.after
    ? taskCursor.decode(args.after).direction
    : 'asc'

  const rows = await context.taskRepo.findByUserIdPaginated(
    context.currentUser.id,
    { first: first ?? 10, after: args.after },
  )

  const connection = buildTaskConnection(rows, first, direction)

  // Prime the dataloader cache
  connection.edges.forEach(({ node }) => context.tasks.prime(node.id, node))

  return {
    edges: connection.edges.map(edge => ({
      node: taskToGraphQL(edge.node),
      cursor: edge.cursor,
    })),
    pageInfo: connection.pageInfo,
  }
}

export const completions: TaskResolvers<Context>['completions'] = async (
  parent,
  { first, ...args },
  context,
) => {
  assertAuthenticated(context)
  const requested = first ?? 10

  const completionResults =
    await context.taskCompletionRepo.findByTaskIdPaginated(
      fromGlobalId(parent.id, 'Task'),
      context.currentUser.id,
      { first: requested, ...args },
    )

  const connection = buildTaskCompletionConnection(completionResults, requested)

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
