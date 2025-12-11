import { loadEntryPoint as relayLoadEntryPoint } from 'react-relay'
import type { PreloadedEntryPoint } from 'react-relay'
import type {
  GetEntryPointComponentFromEntryPoint,
  GetEntryPointParamsFromEntryPoint,
} from 'react-relay/relay-hooks/helpers'
import { environment } from './environment.ts'

export function loadEntryPoint<TEntryPoint>(
  entrypoint: TEntryPoint,
  params: GetEntryPointParamsFromEntryPoint<TEntryPoint>,
): PreloadedEntryPoint<GetEntryPointComponentFromEntryPoint<TEntryPoint>> {
  return relayLoadEntryPoint(
    { getEnvironment: () => environment },
    entrypoint,
    params,
  )
}
