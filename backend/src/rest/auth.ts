import { type FastifyInstance, type FastifySchema } from 'fastify'
import { type } from 'arktype'
import { db } from '../database/index.ts'
import { createUserRepository } from '../repositories/user.ts'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NoResultError } from 'kysely'
import { SqliteError } from 'better-sqlite3'
import { getEnv } from '../env.ts'

const LoginSchema = type({
  email: 'string',
  password: 'string',
})

const schema = {
  body: LoginSchema.toJsonSchema({ dialect: null }),
}

const loginError = {
  success: false,
  errors: [{ message: 'Invalid username or password' }],
}

export const authRoutes = async (fastify: FastifyInstance, options: any) => {
  const env = getEnv()
  const userRepo = createUserRepository(db) // on request? Or on start?

  fastify.post('/login', { schema }, async (request, reply) => {
    const body = request.body as typeof LoginSchema.infer
    try {
      const userRow = await userRepo.findByEmail(body.email)
      const valid = await compare(body.password, userRow.password_hash)

      if (!valid) return loginError

      const token = await jwt.sign({ userId: userRow.id }, env.JWT_SECRET)

      return {
        success: true,
        access_token: token,
      }
    } catch (err) {
      if (err instanceof NoResultError) {
        return loginError
      }

      throw err
    }
  })
}
