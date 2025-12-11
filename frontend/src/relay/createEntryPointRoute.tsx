/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file is mostly type nonsense to get the same type derivations working
 * that Relay uses internally; you mostly don't have to care about this
 */
import { EntryPointContainer } from 'react-relay'
import type { PreloadedEntryPoint, EntryPointComponent } from 'react-relay'
import type {
  GetEntryPointComponentFromEntryPoint,
  GetEntryPointParamsFromEntryPoint,
} from 'react-relay/relay-hooks/helpers'
import { useLoaderData } from 'react-router'
import { loadEntryPoint } from './loadEntrypoint.ts'

type GetRuntimePropsFromEntryPointComponent<TComponent> =
  TComponent extends EntryPointComponent<any, any, infer TRuntimeProps, any>
    ? TRuntimeProps
    : never

export type GetRuntimePropsFromEntryPoint<TEntryPoint> =
  GetRuntimePropsFromEntryPointComponent<
    GetEntryPointComponentFromEntryPoint<TEntryPoint>
  >

type GetComponentFromPreloadedEntryPoint<T> =
  T extends PreloadedEntryPoint<infer C> ? C : never

type GetRuntimePropsFromComponent<T> =
  T extends EntryPointComponent<any, any, infer R, any> ? R : never

type EntryPointRouteConfig<TEntryPoint> = {
  loader: () => PreloadedEntryPoint<
    GetEntryPointComponentFromEntryPoint<TEntryPoint>
  >
  Component: (
    props: GetRuntimePropsFromEntryPoint<TEntryPoint>,
  ) => React.ReactElement
}

export function createEntryPointRoute<TEntryPoint>(
  entrypoint: TEntryPoint,
  params: GetEntryPointParamsFromEntryPoint<TEntryPoint>,
  runtimeProps: GetRuntimePropsFromEntryPoint<TEntryPoint>,
): EntryPointRouteConfig<TEntryPoint> {
  type TComponent = GetEntryPointComponentFromEntryPoint<TEntryPoint>
  type TRef = PreloadedEntryPoint<TComponent>
  type TRuntimeProps = GetRuntimePropsFromComponent<
    GetComponentFromPreloadedEntryPoint<TRef>
  >

  return {
    loader: () => loadEntryPoint(entrypoint, params),
    Component: function EntryPointRouteComponent() {
      const entryPointReference = useLoaderData() as TRef
      return (
        <EntryPointContainer
          entryPointReference={entryPointReference}
          props={runtimeProps as TRuntimeProps}
        />
      )
    },
  }
}
