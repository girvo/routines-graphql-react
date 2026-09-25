import { type } from 'arktype'
import { parseISO } from 'date-fns'
import type { UserRow } from './user-repository.ts'

const UserDomain = type({
  id: 'number',
  email: 'string',
  name: 'string',
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
    name: input.name,
    passwordHash: input.password_hash,
    createdAt: parseISO(input.created_at),
    updatedAt: input.updated_at ? parseISO(input.updated_at) : null,
    lastLoggedIn: input.last_logged_in ? parseISO(input.last_logged_in) : null,
  })

  return UserDomain.assert(result)
}

export const deriveInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('')
}
