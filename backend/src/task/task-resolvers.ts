import { buildTaskConnection, taskToGraphQL } from './task-domain.ts'
import type { NodeResolver } from '../graphql/types.ts'
import type { QueryResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'

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

  const rows = await context.taskRepo.findByUserIdPaginated(
    context.currentUser.id,
    { first: first ?? 10, after: args.after },
  )

  const connection = buildTaskConnection(rows, first)

  // Prime the dataloader cache
  connection.edges.forEach(({ node }) => context.tasks.prime(node.id, node))

  return {
    __typename: 'TaskConnection',
    edges: connection.edges.map(edge => ({
      __typename: 'TaskEdge',
      node: taskToGraphQL(edge.node),
      cursor: edge.cursor,
    })),
    pageInfo: connection.pageInfo,
  }
}
