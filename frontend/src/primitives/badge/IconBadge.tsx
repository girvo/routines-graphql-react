import type { ComponentType } from 'react'
import { clsx } from 'clsx'
import styles from './IconBadge.module.css'

type IconComponent = ComponentType<{ className?: string }>

type IconBadgeProps = {
  icon: IconComponent
  size?: 'sm' | 'md'
  className?: string
  'aria-label'?: string
}

export const IconBadge = ({
  icon: Icon,
  size = 'md',
  className,
  ...rest
}: IconBadgeProps) => (
  <span className={clsx(styles.chip, styles[size], className)} {...rest}>
    <Icon className={styles.icon} />
  </span>
)
