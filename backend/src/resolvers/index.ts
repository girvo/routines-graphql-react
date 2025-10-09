import type { Resolvers } from '../resolvers-types.ts'
import type { Context } from '../context/index.ts'
import hello from './hello.ts'

const resolvers: Resolvers<Context> = {
  Query: {
    hello: (_, {}, c) => {
      return `${c.blah}!`
    },
  },
}

export default resolvers
