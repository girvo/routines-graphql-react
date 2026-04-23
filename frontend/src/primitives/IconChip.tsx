import type { ComponentType } from 'react'
import { cn } from '../utils/tailwind.ts'
import styles from './IconChip.module.css'

type IconComponent = ComponentType<{ className?: string }>

type IconChipProps = {
  icon: IconComponent
  size?: 'sm' | 'md'
  className?: string
  'aria-label'?: string
}

export const IconChip = ({
  icon: Icon,
  size = 'md',
  className,
  ...rest
}: IconChipProps) => (
  <span className={cn(styles.chip, styles[size], className)} {...rest}>
    <Icon className={styles.icon} />
  </span>
)
