import { clsx } from 'clsx'
import styles from './SlotBadge.module.css'

type SlotBadgeProps = {
  section: string
  count: number
  variant?: 'filled' | 'ghost'
  className?: string
}

export const SlotBadge = ({
  section,
  count,
  variant = 'filled',
  className,
}: SlotBadgeProps) => (
  <span className={clsx(styles.root, styles[variant], className)}>
    <span className={styles.section}>{section}</span>
    <span className={styles.count}>×{count}</span>
  </span>
)
