import { createContext, useEffect, use, type ReactNode } from 'react'

export interface PageHeaderSlots {
  title: string | null
  subtitle: ReactNode
  actions: ReactNode
  belowHeader: ReactNode
}

export interface PageHeaderContextValue extends PageHeaderSlots {
  setSlots: (slots: Partial<PageHeaderSlots>) => void
  clearSlots: (keys: Array<keyof PageHeaderSlots>) => void
}

const emptyContext: PageHeaderContextValue = {
  title: null,
  subtitle: null,
  actions: null,
  belowHeader: null,
  setSlots: () => {},
  clearSlots: () => {},
}

export const PageHeaderContext = createContext<PageHeaderContextValue>(emptyContext)

interface UsePageHeaderInput {
  title?: string
  subtitle?: ReactNode
  actions?: ReactNode
  belowHeader?: ReactNode
}

export const usePageHeader = ({ title, subtitle, actions, belowHeader }: UsePageHeaderInput) => {
  const { setSlots, clearSlots } = use(PageHeaderContext)

  useEffect(() => {
    const slots: Partial<PageHeaderSlots> = {}
    const keys: Array<keyof PageHeaderSlots> = []
    if (title !== undefined) {
      slots.title = title
      keys.push('title')
    }
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
  }, [title, subtitle, actions, belowHeader, setSlots, clearSlots])
}
