import type { NodeLoader } from '../graphql/types.ts'
import { assertAuthenticated } from '../graphql/context.ts'

export const resolveUserAsNode: NodeLoader<'User', number> = async (
  id,
  context,
) => {
  assertAuthenticated(context)

  if (id !== context.currentUser.id) {
    return null
  }

  const user = await context.users.load(id)

  if (!user) {
    return null
  }

  return user
}
