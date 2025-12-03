import { createApp } from '../../src/main.ts'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { ExecutionResult } from 'graphql'
import { print } from 'graphql'

export const createTestApp = async () => {
  const { app, yoga } = await createApp({ maskedErrors: false })
  return { app, yoga }
}

export const executeGraphQL = async <Result, Variables>(
  yoga: Awaited<ReturnType<typeof createApp>>['yoga'],
  operation: TypedDocumentNode<Result, Variables>,
  variables?: Variables,
  userToken?: string,
): Promise<ExecutionResult<Result>> => {
  let extraHeaders = {} as Record<string, unknown>
  if (userToken) {
    extraHeaders['Authorization'] = `Bearer ${userToken}`
  }

  const query = print(operation)
  console.debug(operation)

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
