import { cn } from '../utils/tailwind.ts'
import styles from './SlotChip.module.css'

type SlotChipProps = {
  section: string
  count: number
  variant?: 'filled' | 'ghost'
  className?: string
}

export const SlotChip = ({
  section,
  count,
  variant = 'filled',
  className,
}: SlotChipProps) => (
  <span className={cn(styles.root, styles[variant], className)}>
    <span className={styles.section}>{section}</span>
    <span className={styles.count}>×{count}</span>
  </span>
)
