import type { UserDomain } from '../domains/user.ts'
import type { NodeResolver } from './node.ts'
import { toGlobalId } from '../globalId.ts'
import { userToGraphQL } from '../mappers/user.ts'

export const resolveUserAsNode: NodeResolver<'User'> = async (id, context) => {
  const user = await context.users.load(id)

  if (!user || user instanceof Error) {
    return null
  }

  return userToGraphQL(user)
}
