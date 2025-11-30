import type { FastifyInstance } from 'fastify'
import { type } from 'arktype'
import { db } from '../database/index.ts'
import { userRepo } from '../graphql/context.ts'
import { compare, hash } from 'bcryptjs'
import { NoResultError } from 'kysely'
import { getEnv } from '../env.ts'
import { SqliteError } from 'better-sqlite3'
import * as User from '../user/user-domain.ts'
import * as RefreshToken from './refresh-token-domain.ts'
import { createRefreshTokenRepository } from './refresh-token-repository.ts'
import {
  generateRefreshToken,
  hashRefreshToken,
  createAccessToken,
  getRefreshTokenExpiry,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from './auth-utils.ts'

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

const refreshTokenRepo = createRefreshTokenRepository(db)

export const authRoutes = async (fastify: FastifyInstance) => {
  const env = getEnv()

  fastify.post('/login', { schema }, async (request, reply) => {
    const body = request.body as typeof AuthSchema.infer
    try {
      const user = await userRepo
        .findByEmail(body.email)
        .then(User.tableToDomain)
      const valid = await compare(body.password, user.passwordHash)

      if (!valid) return loginError

      const token = createAccessToken(user.id, env.JWT_SECRET)

      const refreshToken = generateRefreshToken()
      const tokenHash = hashRefreshToken(refreshToken, env.JWT_SECRET)
      const expiresAt = getRefreshTokenExpiry()

      await refreshTokenRepo.createRefreshToken(
        user.id,
        tokenHash,
        expiresAt,
        request.headers['user-agent'],
        request.ip,
      )

      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
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

  fastify.post('/signup', { schema }, async (request, reply) => {
    const body = request.body as typeof AuthSchema.infer
    try {
      const passHash = await hash(body.password, 10)
      const user = await userRepo
        .createUser(body.email, passHash)
        .then(User.tableToDomain)

      const token = createAccessToken(user.id, env.JWT_SECRET)

      const refreshToken = generateRefreshToken()
      const tokenHash = hashRefreshToken(refreshToken, env.JWT_SECRET)
      const expiresAt = getRefreshTokenExpiry()

      await refreshTokenRepo.createRefreshToken(
        user.id,
        tokenHash,
        expiresAt,
        request.headers['user-agent'],
        request.ip,
      )

      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
      })

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

    try {
      const tokenHash = hashRefreshToken(refreshToken, env.JWT_SECRET)
      const storedToken = await refreshTokenRepo.findByTokenHash(tokenHash)

      if (!storedToken) {
        reply.clearCookie('refreshToken')
        return reply.code(401).send({
          success: false,
          errors: [{ message: 'Invalid refresh token' }],
        })
      }

      const tokenDomain = RefreshToken.tableToDomain(storedToken)

      if (tokenDomain.revokedAt) {
        reply.clearCookie('refreshToken')
        return reply.code(401).send({
          success: false,
          errors: [{ message: 'Refresh token has been revoked' }],
        })
      }

      if (tokenDomain.expiresAt < new Date()) {
        reply.clearCookie('refreshToken')
        return reply.code(401).send({
          success: false,
          errors: [{ message: 'Refresh token has expired' }],
        })
      }

      const newAccessToken = createAccessToken(
        tokenDomain.userId,
        env.JWT_SECRET,
      )

      return {
        success: true,
        accessToken: newAccessToken,
      }
    } catch (err) {
      reply.clearCookie('refreshToken')
      throw err
    }
  })

  fastify.post('/logout', {}, async (request, reply) => {
    const refreshToken = request.cookies.refreshToken

    if (!refreshToken) {
      console.warn('Logout called without a refresh token in the request')
      return reply.code(200).send({
        success: true,
      })
    }

    try {
      const tokenHash = hashRefreshToken(refreshToken, env.JWT_SECRET)
      const storedToken = await refreshTokenRepo.findByTokenHash(tokenHash)

      if (storedToken) {
        await refreshTokenRepo.revokeToken(storedToken.id)
      }

      reply.clearCookie('refreshToken')

      return {
        success: true,
      }
    } catch (err) {
      reply.clearCookie('refreshToken')
      throw err
    }
  })
}
