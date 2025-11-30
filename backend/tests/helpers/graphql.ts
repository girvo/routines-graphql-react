import type { Kysely } from 'kysely'
import type { Database } from '../../src/database/types.ts'
import { createApp } from '../../src/main.ts'

export const createTestApp = async (testDb: Kysely<Database>) => {
  const { app, yoga } = await createApp({ maskedErrors: false }, testDb)
  return { app, yoga }
}

export const executeGraphQL = async (
  yoga: Awaited<ReturnType<typeof createApp>>['yoga'],
  query: string,
  variables?: Record<string, unknown>,
  userToken?: string,
) => {
  let extraHeaders = {} as Record<string, unknown>
  if (userToken) {
    extraHeaders['Authorization'] = `Bearer ${userToken}`
  }

  const response = await yoga.fetch('http://localhost/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return await response.json()
}
