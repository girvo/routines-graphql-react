import type { Resolvers, Scalars } from './types.ts'
import type { Context } from '../context/index.ts'
import { DateTimeResolver } from 'graphql-scalars'
import { GraphQLError } from 'graphql'
import { toGlobalId } from '../globalId.ts'
import * as UserDomain from '../domains/user.ts'

const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return 'world'
    },
    me: async (_, {}, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('No user in context')
      }

      // NOTE: This isn't actually needed: we've already loaded it, this is just a test
      const user = await context.users.load(context.currentUser.id)

      if (!user) {
        throw new GraphQLError(
          `No user found by this ID: ${context.currentUser.id}`,
        )
      }

      return {
        __typename: 'User',
        id: toGlobalId('User', user.id),
        email: user.email,
        createdAt: user.createdAt,
      }
    },
  },
  // Custom scalars
  DateTime: DateTimeResolver,
  User: {
    id: parent => parent.id,
    email: parent => parent.email,
    createdAt: parent => parent.createdAt,
  },
}

export default resolvers
