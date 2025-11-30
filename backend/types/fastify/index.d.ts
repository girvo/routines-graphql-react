import fastify from 'fastify'
import type { Database } from '../../src/database/types.ts'
import type { Kysely } from 'kysely'

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    db: Kysely<Database>
  }
}
