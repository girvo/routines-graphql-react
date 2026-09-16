/**
 * Push endpoints are only accepted when their host resolves to a public address
 * (see `backend/src/push/endpoint-policy.ts`), and the test suite cannot depend
 * on live DNS, so resolution is injected. Hostnames not listed in `overrides`
 * look public.
 */
import type { HostAddressResolver } from '../../src/push/endpoint-policy.ts'

export const PUBLIC_PUSH_ADDRESS = '93.184.216.34'

export const createFakeHostResolver = (
  overrides: Record<string, string[]> = {},
): HostAddressResolver => {
  return async hostname => {
    const addresses = overrides[hostname]

    if (addresses === undefined) return [PUBLIC_PUSH_ADDRESS]
    if (addresses.length === 0) throw new Error(`ENOTFOUND ${hostname}`)

    return addresses
  }
}
