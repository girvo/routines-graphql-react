import { loadEntryPoint as relayLoadEntryPoint } from 'react-relay'
import type { GetEntryPointParamsFromEntryPoint } from 'react-relay/relay-hooks/helpers'
import { environment } from './environment.ts'

export function loadEntryPoint<TEntryPoint>(
  entrypoint: TEntryPoint,
  params: GetEntryPointParamsFromEntryPoint<TEntryPoint>,
) {
  return relayLoadEntryPoint(
    { getEnvironment: () => environment },
    entrypoint,
    params,
  )
}
