import { createApp } from '../../src/main.ts'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { ExecutionResult } from 'graphql'
import { print } from 'graphql'

export type YogaApp = Awaited<ReturnType<typeof createApp>>['yoga']

export const createTestApp = async () => {
  const { app, yoga } = await createApp({ maskedErrors: false })
  return { app, yoga }
}

export const executeGraphQL = async <Result, Variables>(
  operation: TypedDocumentNode<Result, Variables>,
  variables: Variables,
  environment: {
    yoga: YogaApp
    userToken?: string
  },
): Promise<ExecutionResult<Result>> => {
  let extraHeaders = {} as Record<string, unknown>
  if (environment.userToken) {
    extraHeaders['Authorization'] = `Bearer ${environment.userToken}`
  }

  const query = print(operation)

  const response = await environment.yoga.fetch('http://localhost/graphql', {
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
