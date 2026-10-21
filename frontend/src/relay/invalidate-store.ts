import type { RecordSourceSelectorProxy } from 'relay-runtime'

export const invalidateStoreOnSuccess =
  (payloadField: string) =>
  (
    store: RecordSourceSelectorProxy,
    payload: Record<string, unknown> | null | undefined,
  ) => {
    if (payload?.[payloadField] == null) return
    store.invalidateStore()
  }
