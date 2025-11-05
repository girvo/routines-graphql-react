import type { Resolvers, Scalars } from './types.ts'
import type { Context } from '../context/index.ts'
import hello from './hello.ts'
import { DateTimeResolver } from 'graphql-scalars'

const resolvers: Resolvers<Context> = {
  Query: {
    hello: () => {
      return 'world'
    },
    another: () => 'test',
  },
  Mutation: {},
  // Custom scalars
  DateTime: DateTimeResolver,
}

export default resolvers
