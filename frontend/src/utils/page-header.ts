import { createContext, useEffect, use, type ReactNode } from 'react'

export interface PageHeaderSlots {
  subtitle: ReactNode
  actions: ReactNode
  belowHeader: ReactNode
}

export interface PageHeaderContextValue extends PageHeaderSlots {
  setSlots: (slots: Partial<PageHeaderSlots>) => void
  clearSlots: (keys: Array<keyof PageHeaderSlots>) => void
}

const emptyContext: PageHeaderContextValue = {
  subtitle: null,
  actions: null,
  belowHeader: null,
  setSlots: () => {},
  clearSlots: () => {},
}

export const PageHeaderContext = createContext<PageHeaderContextValue>(emptyContext)

interface UsePageHeaderInput {
  subtitle?: ReactNode
  actions?: ReactNode
  belowHeader?: ReactNode
}

export const usePageHeader = ({ subtitle, actions, belowHeader }: UsePageHeaderInput) => {
  const { setSlots, clearSlots } = use(PageHeaderContext)

  useEffect(() => {
    const slots: Partial<PageHeaderSlots> = {}
    const keys: Array<keyof PageHeaderSlots> = []
    if (subtitle !== undefined) {
      slots.subtitle = subtitle
      keys.push('subtitle')
    }
    if (actions !== undefined) {
      slots.actions = actions
      keys.push('actions')
    }
    if (belowHeader !== undefined) {
      slots.belowHeader = belowHeader
      keys.push('belowHeader')
    }
    setSlots(slots)
    return () => clearSlots(keys)
  }, [subtitle, actions, belowHeader, setSlots, clearSlots])
}
