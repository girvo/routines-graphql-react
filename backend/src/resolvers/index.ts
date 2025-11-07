import type { Resolvers, Scalars } from './types.ts'
import type { Context } from '../context/index.ts'
import { DateTimeResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import { decodeGlobalId } from '../globalId.ts'
import { getUser } from '../context/auth.ts'
import { userToGraphQL } from '../mappers/user.ts'
import { nodeResolvers } from './node.ts'

const resolvers: Resolvers<Context> = {
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
  },
  Node: {
    __resolveType: (parent, _, info) => parent.__typename ?? null,
  },
  // Custom scalars
  DateTime: DateTimeResolver,
}

export default resolvers
