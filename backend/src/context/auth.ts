import { type Context } from './index.ts'
import { type ResolveUserFn, type ValidateUserFn } from '@envelop/generic-auth'
import { type UserDomain, tableToDomain } from '../domains/user.ts'
import { type } from 'arktype'
import { GraphQLError } from 'graphql'

const JwtPayload = type({
  userId: 'number',
  iat: 'number',
  exp: 'number',
})

export const resolveUser: ResolveUserFn<
  UserDomain,
  Context
> = async context => {
  try {
    const { userId } = JwtPayload.assert(context.jwt?.payload)

    // Checks that the user exists correctly in the DB from the JWT
    const user = await context.users.load(userId)

    return user
  } catch (e) {
    return null
  }
}

export const validateUser: ValidateUserFn<UserDomain> = params => {
  if (params.fieldDirectives?.skipAuth) return

  if (!params.user) {
    return new GraphQLError('Unauthenticated!')
  }
}
