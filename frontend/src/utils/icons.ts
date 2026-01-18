import { iconNames, type IconName } from 'lucide-react/dynamic'

export const parseIconName = (name: string | null | undefined): IconName =>
  name && iconNames.includes(name as IconName) ? (name as IconName) : 'list-todo'
