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

  return {
    edges: connection.edges.map(edge => ({
      node: taskToGraphQL(edge.node),
      cursor: edge.cursor,
    })),
    pageInfo: connection.pageInfo,
  }
}

// // In your Query resolvers:
// export const taskQueryResolvers = {
//   tasks: async (_, { first = 10, after }, context) => {
//     assertAuthenticated(context)

//     const edgeRows = await context.taskRepo.findTasksPaginated(
//       context.currentUser.id,
//       { first, after }
//     )

//     const connection = buildTaskConnection(edgeRows, first)

//     // Convert to GraphQL format
//     return {
//       edges: connection.edges.map(edge => ({
//         node: taskToGraphQL(edge.node),
//         cursor: edge.cursor,
//         // Include any custom edge fields here if your schema defines them
//       })),
//       pageInfo: connection.pageInfo,
//     }
//   },
// }
