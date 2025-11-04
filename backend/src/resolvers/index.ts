import type { Resolvers } from './types.ts'
import type { Context } from '../context/index.ts'
import hello from './hello.ts'

const resolvers: Resolvers<Context> = {
  Query: {
    hello: (parent: unknown, {}, context) => {
      return `${context.blah}!`
    },
  },
  Mutation: {
    signup: (parent: unknown, { input }, context) => {},
  },
}

export default resolvers
