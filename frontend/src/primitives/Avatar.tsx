import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './Avatar.module.css'

type AvatarProps = {
  initials?: string
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

export const Avatar = ({ initials, className, ...rest }: AvatarProps) => (
  <span
    aria-hidden={initials ? undefined : true}
    className={clsx(styles.root, className)}
    {...rest}
  >
    {initials}
  </span>
)
