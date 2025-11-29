import type { Resolvers, Scalars } from './resolver-types.ts'
import type { Context } from './context.ts'
import { DateTimeResolver, NonNegativeIntResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import { decodeGlobalId } from '../globalId.ts'
import { getUser } from '../auth/auth-context.ts'
import { userToGraphQL } from '../user/user-domain.ts'
import { resolveUserAsNode } from '../user/user-resolvers.ts'
import type { NodeResolver, NodeType } from './types.ts'
import { resolveTaskAsNode, tasksResolver } from '../task/task-resolvers.ts'

const nodeResolvers: { [NodeName in NodeType]: NodeResolver<NodeName> } = {
  User: resolveUserAsNode,
  Task: resolveTaskAsNode,
}

export const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return 'world'
    },
    me: async (_, {}, context) => {
      const user = await getUser(context)
      return userToGraphQL(user)
    },
    node: async (_, { id }, context) => {
      let type: string
      let internalId: number

      try {
        const decoded = decodeGlobalId(id)
        type = decoded.type
        internalId = decoded.id
      } catch (error) {
        throw new GraphQLError('Invalid node ID', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const adapter = nodeResolvers[type as keyof typeof nodeResolvers]

      if (!adapter) {
        throw new GraphQLError(`Unknown node type: ${type}`, {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      return adapter(internalId, context)
    },
    tasks: tasksResolver,
  },
  Node: {
    __resolveType: parent => parent.__typename ?? null,
  },
  Task: {
    completions: (parent, args, context) => {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      }
    },
    slots: () => {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      }
    },
  },
  // Custom scalars
  DateTime: DateTimeResolver,
  NonNegativeInt: NonNegativeIntResolver,
}
