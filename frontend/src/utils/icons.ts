import { iconNames, type IconName } from 'lucide-react/dynamic'

export const iconNameSet = new Set<string>(iconNames)

export const isValidIconName = (name: string): name is IconName =>
  iconNameSet.has(name)

export const parseIconName = (name: string | null | undefined): IconName =>
  name && isValidIconName(name) ? name : 'list-todo'
