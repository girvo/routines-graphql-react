import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import {
  createSchema,
  createYoga,
  useExecutionCancellation,
} from 'graphql-yoga'
import { readFile } from 'node:fs/promises'
import * as resolvers from './resolvers/index.ts'

const schema = await readFile('../../schema.graphql', 'utf-8')

const app = fastify({ logger: true })

const yoga = createYoga<{
  req: FastifyRequest
  reply: FastifyReply
}>({
  plugins: [useExecutionCancellation()],
  schema: createSchema({
    typeDefs: schema,
    resolvers: {
      Query: {
        hello: resolvers.hello,
      },
    },
  }),

  // Integrate Fastify logger
  logging: {
    debug: (...args) => args.forEach(arg => app.log.debug(arg)),
    info: (...args) => args.forEach(arg => app.log.info(arg)),
    warn: (...args) => args.forEach(arg => app.log.warn(arg)),
    error: (...args) => args.forEach(arg => app.log.error(arg)),
  },
})

/**
 * We pass the incoming HTTP request to GraphQL Yoga
 * and handle the response using Fastify's `reply` API
 * Learn more about `reply` https://www.fastify.io/docs/latest/Reply/
 **/
app.route({
  // Bind to the Yoga's endpoint to avoid rendering on any path
  url: yoga.graphqlEndpoint,
  method: ['GET', 'POST', 'OPTIONS'],
  handler: (req, reply) =>
    yoga.handleNodeRequestAndResponse(req, reply, {
      req,
      reply,
    }),
})

// This will allow Fastify to forward multipart requests to GraphQL Yoga
app.addContentTypeParser('multipart/form-data', {}, (req, payload, done) =>
  done(null),
)

app.listen({ port: 4000 })
