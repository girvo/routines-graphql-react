/**
 * This is mainly used for Entrypoint processing
 */
import type { PreloadedQuery, GraphQLTaggedNode } from 'react-relay'
import type { ComponentType } from 'react'
import type { OperationType } from 'relay-runtime'

export type EntryPoint<TQuery extends OperationType, TProps = object> = {
  // The component to render for the entrypoint (note it is a promise)
  root: () => Promise<{
    default: ComponentType<TProps & { queryRef: PreloadedQuery<TQuery> }>
  }>

  // The query to preload
  query: GraphQLTaggedNode

  // Extract variables from route params (or similar) for the query to use for execution
  getVariables: (params: Record<string, string>) => TQuery['variables']
}
