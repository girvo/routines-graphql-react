import type { UserDomain } from './user-domain.ts'
import { toGlobalId } from '../globalId.ts'

export const userToGraphQL = (user: UserDomain) => ({
  __typename: 'User' as const,
  id: toGlobalId('User', user.id),
  email: user.email,
  createdAt: user.createdAt,
})
