import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { toGlobalId } from '../globalId.ts'
import type { MutationResolvers } from './types.ts'
import type { Context } from '../context/index.ts'
import { NoResultError } from 'kysely'

export const signup: MutationResolvers<Context>['signup'] = async (
  parent: unknown,
  { email, password },
  context,
) => {
  try {
    const passHash = await hash(password, 10)
    const userRow = await context.userRepo.createUser(email, passHash)
    const token = await jwt.sign({ userId: userRow.id }, context.env.JWT_SECRET)

    return {
      __typename: 'AuthPayload',
      token: token,
      user: {
        id: toGlobalId('User', userRow.id),
        email: userRow.email,
        createdAt: new Date(userRow.created_at.replace(' ', 'T') + 'Z'), // TODO: This is naff, just parse it better
      },
    }
  } catch (e) {
    return {
      __typename: 'SignupError',
      message: (e as Error).message,
    }
  }
}

const InvalidLoginError = {
  __typename: 'LoginError',
  message: 'Invalid username or password',
} as const

export const login: MutationResolvers<Context>['login'] = async (
  parent: unknown,
  { email, password },
  context,
) => {
  try {
    console.debug(context)

    const userRow = await context.userRepo.findByEmail(email)
    const valid = await compare(password, userRow.password_hash)
    if (!valid) return InvalidLoginError

    const token = await jwt.sign({ userId: userRow.id }, context.env.JWT_SECRET)

    return {
      __typename: 'AuthPayload',
      token,
      user: {
        id: toGlobalId('User', userRow.id),
        email: userRow.email,
        createdAt: new Date(userRow.created_at.replace(' ', 'T') + 'Z'), // TODO: This is naff, just parse it better
      },
    }
  } catch (e) {
    if (e instanceof NoResultError) {
      return InvalidLoginError
    }

    // DEBUGGING
    return {
      __typename: 'LoginError',
      message: (e as Error).message,
    }
  }
}
