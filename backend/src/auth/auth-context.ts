import { type Context } from '../graphql/context.ts'
import { type ResolveUserFn, type ValidateUserFn } from '@envelop/generic-auth'
import { type UserDomain, tableToDomain } from '../user/user-domain.ts'
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
  if (params.fieldDirectives?.skipAuth) {
    console.debug('YO WE GOT A SKIPAUTH REQ')
    return
  }

  if (!params.user) {
    return new GraphQLError('Unauthenticated!')
  }
}

export const getUser = async (context: Context) => {
  if (!context.currentUser) {
    throw new GraphQLError('No user in context')
  }

  // NOTE: This isn't actually needed: we've already loaded it, this is just a test
  const user = await context.users.load(context.currentUser.id)

  if (!user) {
    throw new GraphQLError(
      `No user found by this ID: ${context.currentUser.id}`,
    )
  }

  return user
}
