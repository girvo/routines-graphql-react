import { type UserDomain, userToGraphQL } from './user-domain.ts'
import type { NodeResolver } from '../graphql/types.ts'
import { assertAuthenticated } from '../graphql/context.ts'
import { toGlobalId } from '../globalId.ts'

export const resolveUserAsNode: NodeResolver<'User'> = async (id, context) => {
  assertAuthenticated(context)

  if (id !== context.currentUser.id) {
    return null
  }

  const user = await context.users.load(id)

  if (!user || user instanceof Error) {
    return null
  }

  return userToGraphQL(user)
}
