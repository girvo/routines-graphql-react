import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import {
  createSchema,
  createYoga,
  useExecutionCancellation,
} from 'graphql-yoga'
import {
  createInlineSigningKeyProvider,
  createRemoteJwksSigningKeyProvider,
  extractFromHeader,
  useJWT,
} from '@graphql-yoga/plugin-jwt'
import { readFile } from 'node:fs/promises'
import { env } from 'node:process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import resolvers from './resolvers/index.ts'
import { createContext } from './context/index.ts'

const schemaFile = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'schema.graphql',
)
const schema = await readFile(schemaFile, 'utf-8')
const signingKey = env['JWT_SECRET'] ?? ''

if (signingKey === '') {
  throw new Error('Please pass a JWT secret to the environment')
}

const app = fastify({ logger: true })

const yoga = createYoga<{
  req: FastifyRequest
  reply: FastifyReply
}>({
  context: createContext(),
  plugins: [
    useExecutionCancellation(),
    // useJWT({
    //   signingKeyProviders: [createInlineSigningKeyProvider(signingKey)],
    //   tokenLookupLocations: [
    //     extractFromHeader({ name: 'authorization', prefix: 'Bearer' }),
    //   ],
    //   tokenVerification: {
    //     algorithms: ['HS256', 'RS256'],
    //   },
    //   extendContext: true,
    //   reject: {
    //     missingToken: true,
    //     invalidToken: true,
    //   },
    // }),
  ],
  schema: createSchema({
    typeDefs: schema,
    resolvers: resolvers,
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
