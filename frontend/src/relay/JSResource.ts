import type { JSResourceReference } from 'react-relay'

export function JSResource<TModule>(
  moduleId: string,
  loader: () => Promise<TModule>,
): JSResourceReference<TModule> {
  let modulePromise: Promise<TModule> | null = null
  let module: TModule | null = null

  return {
    getModuleId(): string {
      return moduleId
    },

    getModuleIfRequired(): TModule | null {
      return module
    },

    load(): Promise<TModule> {
      if (modulePromise == null) {
        modulePromise = loader().then(m => {
          module = m
          return m
        })
      }
      return modulePromise
    },
  }
}
