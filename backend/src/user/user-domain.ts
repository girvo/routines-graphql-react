import { sqliteDateToDate } from '../database/utils.ts'
import { type } from 'arktype'
import { toGlobalId } from '../globalId.ts'
import type { UserRow } from './user-repository.ts'

const UserDomain = type({
  id: 'number',
  email: 'string',
  passwordHash: 'string',
  createdAt: 'Date',
  updatedAt: 'Date | null',
  lastLoggedIn: 'Date | null',
})

export type UserDomain = typeof UserDomain.infer

export const tableToDomain = (input: UserRow): UserDomain => {
  const result = UserDomain({
    id: input.id,
    email: input.email,
    passwordHash: input.password_hash,
    createdAt: sqliteDateToDate(input.created_at),
    updatedAt: input.updated_at ? sqliteDateToDate(input.updated_at) : null,
    lastLoggedIn: input.last_logged_in
      ? sqliteDateToDate(input.last_logged_in)
      : null,
  })

  return UserDomain.assert(result)
}

export const userToGraphQL = (user: UserDomain) => ({
  __typename: 'User' as const,
  id: toGlobalId('User', user.id),
  email: user.email,
  createdAt: user.createdAt,
})

export type UserNode = ReturnType<typeof userToGraphQL>
