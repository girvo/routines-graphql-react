import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import {
  createSchema,
  createYoga,
  useExecutionCancellation,
  type YogaServerOptions,
} from 'graphql-yoga'
import {
  createInlineSigningKeyProvider,
  extractFromHeader,
  useJWT,
} from '@graphql-yoga/plugin-jwt'
import { readFile } from 'node:fs/promises'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolvers } from './graphql/resolvers.ts'
import { createContext } from './graphql/context.ts'
import { resolveUser, validateUser } from './auth/auth-context.ts'
import { getEnv } from './env.ts'
import { authRoutes } from './auth/auth-routes.ts'
import { useGenericAuth } from '@envelop/generic-auth'
import { useDataLoader } from '@envelop/dataloader'
import { userDataLoader } from './user/user-loaders.ts'
import cookie from '@fastify/cookie'
import { taskDataLoader } from './task/task-loaders.ts'
import { routineSlotDataLoader } from './routine-slot/routine-slot-loaders.ts'
import { taskCompletionDataLoader } from './task-completion/task-completion-loaders.ts'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'
import { db } from './database/index.ts'

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

export const createApp = async (
  options: YogaServerOptions<
    { req: FastifyRequest; reply: FastifyReply },
    {}
  > = {},
) => {
  const schemaFile = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
    'schema.graphql',
  )
  const schema = await readFile(schemaFile, 'utf-8')
  const signingKey = getEnv().JWT_SECRET

  const app = fastify({
    logger: envToLogger[getEnv().ENVIRONMENT],
  })

  await app.register(cors, {
    origin: true,
    credentials: true,
  })

  await app.register(cookie)

  const yoga = createYoga<{
    req: FastifyRequest
    reply: FastifyReply
  }>({
    cors: false,
    context: initialContext => createContext(initialContext, db),
    plugins: [
      useExecutionCancellation(),
      useJWT({
        signingKeyProviders: [createInlineSigningKeyProvider(signingKey)],
        tokenLookupLocations: [
          extractFromHeader({ name: 'authorization', prefix: 'Bearer' }),
        ],
        tokenVerification: {
          algorithms: ['HS256', 'RS256'],
        },
        extendContext: true,
        reject: {
          missingToken: false,
          invalidToken: false,
        },
      }),
      // This needs to be before useGenericAuth as it relies on this DataLoader
      useDataLoader('users', userDataLoader),
      useGenericAuth({
        resolveUserFn: resolveUser,
        validateUser: validateUser,
        mode: 'protect-all',
      }),
      useDataLoader('tasks', taskDataLoader),
      useDataLoader('routineSlots', routineSlotDataLoader),
      useDataLoader('taskCompletions', taskCompletionDataLoader),
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
    graphiql: false,
    ...options,
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

  // Set up/wire up authentication handling routes
  authRoutes(app)

  await app.register(fastifyStatic, {
    root: resolve(dirname(fileURLToPath(import.meta.url)), 'templates'),
    // prefix: '/public/', // optional: serve files under /public/ URL
  })

  app.get('/graphiql', (request, reply) => {
    return reply.sendFile('graphiql.html')
  })

  return { app, yoga }
}

if (import.meta.main) {
  const { app } = await createApp()
  app.listen({ port: 4000 })
}
