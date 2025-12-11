import { Suspense, useMemo, lazy, type ComponentType } from 'react'
import { useParams } from 'react-router'
import { loadQuery, useRelayEnvironment, type PreloadedQuery } from 'react-relay'
import type { OperationType } from 'relay-runtime'
import type { EntryPoint } from './types.ts'

interface EntryPointRouteProps<TQuery extends OperationType, TProps = object> {
  entrypoint: EntryPoint<TQuery, TProps>
  fallback?: React.ReactNode
}

export function EntryPointRoute<TQuery extends OperationType, TProps = object>({
  entrypoint,
  fallback = <div>Loading...</div>,
}: EntryPointRouteProps<TQuery, TProps>) {
  const environment = useRelayEnvironment()
  const params = useParams()

  const variables = entrypoint.getVariables(params as Record<string, string>)
  const variablesKey = JSON.stringify(variables)

  const queryRef = useMemo(
    () => loadQuery<TQuery>(environment, entrypoint.query, variables),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [environment, entrypoint.query, variablesKey],
  )

  const Component = useMemo(
    () =>
      lazy(entrypoint.root) as ComponentType<
        TProps & { queryRef: PreloadedQuery<TQuery> }
      >,
    [entrypoint.root],
  )

  return (
    <Suspense fallback={fallback}>
      <Component queryRef={queryRef} />
    </Suspense>
  )
}
