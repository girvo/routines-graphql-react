import { createApp } from '../../src/main.ts'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { ExecutionResult } from 'graphql'
import { print } from 'graphql'
import type { PushSender } from '../../src/push/push-sender.ts'
import type { HostAddressResolver } from '../../src/push/endpoint-policy.ts'
import { createFakeHostResolver } from './host-resolver.ts'

export type YogaApp = Awaited<ReturnType<typeof createApp>>['yoga']

export const createTestApp = async (
  options: { pushSender?: PushSender; hostResolver?: HostAddressResolver } = {},
) => {
  const { app, yoga } = await createApp({
    maskedErrors: false,
    // Explicitly provided (including null) wins over the env-derived sender.
    pushSender: 'pushSender' in options ? options.pushSender : undefined,
    // No test suite should depend on live DNS for endpoint reachability.
    hostResolver: options.hostResolver ?? createFakeHostResolver(),
  })
  return { app, yoga }
}

export const executeGraphQL = async <Result, Variables>(
  operation: TypedDocumentNode<Result, Variables>,
  variables: Variables,
  environment: {
    yoga: YogaApp
    userToken?: string
    headers?: Record<string, string>
  },
): Promise<ExecutionResult<Result>> => {
  let extraHeaders = {} as Record<string, unknown>
  if (environment.userToken) {
    extraHeaders['Authorization'] = `Bearer ${environment.userToken}`
  }
  extraHeaders = { ...environment.headers, ...extraHeaders }

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
