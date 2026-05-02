import type { ButtonHTMLAttributes, ComponentType } from 'react'
import { clsx } from 'clsx'
import { CountBadge } from './badge/CountBadge.tsx'
import styles from './NavItem.module.css'

type IconComponent = ComponentType<{ className?: string }>

type NavItemProps = {
  icon: IconComponent
  label: string
  active?: boolean
  count?: number
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export const NavItem = ({
  icon: Icon,
  label,
  active = false,
  count,
  className,
  type = 'button',
  ...rest
}: NavItemProps) => (
  <button
    type={type}
    aria-current={active ? 'page' : undefined}
    className={clsx(styles.root, active && styles.active, className)}
    {...rest}
  >
    <Icon className={styles.icon} />
    <span className={styles.label}>{label}</span>
    {count !== undefined && <CountBadge count={count} className={styles.count} />}
  </button>
)
