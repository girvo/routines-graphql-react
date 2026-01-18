import type { LucideIcon } from 'lucide-react'
import { createContext, useEffect, use } from 'react'

export interface HeaderAction {
  id: string
  icon: LucideIcon
  label: string
  onClick: () => void
}

export interface HeaderActionsContextValue {
  actions: HeaderAction[]
  setActions: (actions: HeaderAction[]) => void
  clearActions: () => void
}

export const HeaderActionsContext = createContext<HeaderActionsContextValue>({
  actions: [],
  setActions: () => {},
  clearActions: () => {},
})

export const useHeaderActions = (actions: HeaderAction[]) => {
  const { setActions, clearActions } = use(HeaderActionsContext)

  useEffect(() => {
    setActions(actions)
    return () => clearActions()
  }, [actions, setActions, clearActions])
}
