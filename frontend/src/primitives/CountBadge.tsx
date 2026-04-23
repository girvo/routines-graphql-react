import { cn } from '../utils/tailwind.ts'
import styles from './CountBadge.module.css'

type CountBadgeProps = {
  count: number
  className?: string
}

export const CountBadge = ({ count, className }: CountBadgeProps) => (
  <span className={cn(styles.root, className)}>{count}</span>
)
