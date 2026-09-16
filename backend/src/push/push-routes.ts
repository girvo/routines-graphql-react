import type { FastifyInstance } from 'fastify'
import { getEnv } from '../env.ts'

/**
 * Plain REST rather than GraphQL: the browser calls this inside the subscribe
 * user-gesture flow, before any Relay environment is involved.
 */
export const pushRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/api/push/public-key', async (_request, reply) => {
    const { VAPID_PUBLIC_KEY } = getEnv()

    if (!VAPID_PUBLIC_KEY) {
      return reply.code(503).send({
        error: 'Push notifications are not configured on this server',
      })
    }

    return { publicKey: VAPID_PUBLIC_KEY }
  })
}
