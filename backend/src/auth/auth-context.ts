import { type Context } from '../graphql/context.ts'
import { type ResolveUserFn, type ValidateUserFn } from '@envelop/generic-auth'
import { type UserDomain } from '../user/user-domain.ts'
import { type } from 'arktype'
import { GraphQLError } from 'graphql'

const JwtPayload = type({
  userId: 'number',
  iat: 'number',
  exp: 'number',
})

const unauthOptions = {
  extensions: { code: 'UNAUTHENTICATED' },
}

export const resolveUser: ResolveUserFn<
  UserDomain,
  Context
> = async context => {
  try {
    const { userId } = JwtPayload.assert(context.jwt?.payload)

    // Checks that the user exists correctly in the DB from the JWT
    const user = await context.users.load(userId)

    return user
  } catch {
    return null
  }
}

export const validateUser: ValidateUserFn<UserDomain> = params => {
  if (params.fieldDirectives?.skipAuth) {
    return
  }

  if (!params.user) {
    return new GraphQLError('Unauthenticated!', unauthOptions)
  }
}

export const getUser = (context: Context) => {
  if (!context.currentUser) {
    throw new GraphQLError('No user in context', unauthOptions)
  }

  return context.currentUser
}
