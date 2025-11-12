import { type } from 'arktype'
import { db } from '../database/index.ts'
import { userRepo } from '../graphql/context.ts'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NoResultError } from 'kysely'
import { getEnv } from '../env.ts'
import { SqliteError } from 'better-sqlite3'
import * as User from '../user/user-domain.ts'
import { type FastifyInstance } from 'fastify'

const AuthSchema = type({
  email: 'string',
  password: 'string',
})

const schema = {
  body: AuthSchema.toJsonSchema({ dialect: null }),
}

const loginError = {
  success: false,
  errors: [{ message: 'Invalid username or password' }],
}

const SignupError = (message: string) => ({
  success: false,
  errors: [{ message }],
})

const signWithExpiry = (id: number, secret: string) =>
  jwt.sign({ userId: id }, secret, {
    expiresIn: '10m',
  })

export const authRoutes = async (fastify: FastifyInstance, options: any) => {
  const env = getEnv()

  fastify.post('/login', { schema }, async (request, reply) => {
    const body = request.body as typeof AuthSchema.infer
    try {
      const user = await userRepo
        .findByEmail(body.email)
        .then(User.tableToDomain)
      const valid = await compare(body.password, user.passwordHash)

      if (!valid) return loginError

      const token = await signWithExpiry(user.id, env.JWT_SECRET)

      // Need to generate a token, store in the database
      reply.setCookie('refresh_token', '', {
        httpOnly: true,
        secure: false, // tbd, I do need HTTPs but I'll deal with this later
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })

      return {
        success: true,
        accessToken: token,
      }
    } catch (err) {
      if (err instanceof NoResultError) {
        return loginError
      }

      throw err
    }
  })

  fastify.post('/signup', { schema }, async request => {
    const body = request.body as typeof AuthSchema.infer
    try {
      const passHash = await hash(body.password, 10)
      const user = await userRepo
        .createUser(body.email, passHash)
        .then(User.tableToDomain)

      const token = await signWithExpiry(user.id, env.JWT_SECRET)

      return {
        success: true,
        accessToken: token,
      }
    } catch (err) {
      if (err instanceof SqliteError) {
        switch (err.code) {
          case 'SQLITE_CONSTRAINT_UNIQUE':
            return SignupError('A user already exists with that email')
          default:
            return SignupError(err.message)
        }
      }

      throw err
    }
  })

  fastify.get('/refresh', {}, async (request, reply) => {
    const refreshToken = request.cookies.refreshToken

    if (!refreshToken) {
      return reply.code(401).send({
        success: false,
        errors: [{ message: 'No refresh token' }],
      })
    }

    return { success: true }
  })
}
