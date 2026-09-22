import type { RecordSourceSelectorProxy } from 'relay-runtime'

export type StoreUpdater = (store: RecordSourceSelectorProxy) => void

export const composeUpdaters =
  (...updaters: readonly (StoreUpdater | null | undefined)[]): StoreUpdater =>
  store => {
    for (const updater of updaters) updater?.(store)
  }
