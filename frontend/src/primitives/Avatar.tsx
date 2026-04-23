import type { HTMLAttributes } from 'react'
import { cn } from '../utils/tailwind.ts'
import styles from './Avatar.module.css'

type AvatarProps = {
  initials?: string
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

export const Avatar = ({ initials, className, ...rest }: AvatarProps) => (
  <span
    aria-hidden={initials ? undefined : true}
    className={cn(styles.root, className)}
    {...rest}
  >
    {initials}
  </span>
)
