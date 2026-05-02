import { clsx } from 'clsx'
import styles from './CountBadge.module.css'

type CountBadgeProps = {
  count: number
  className?: string
}

export const CountBadge = ({ count, className }: CountBadgeProps) => (
  <span className={clsx(styles.root, className)}>{count}</span>
)
