import type { HTMLAttributes } from 'react'
import { cn } from '../utils/tailwind.ts'
import styles from './Divider.module.css'

type DividerProps = {
  inset?: number
} & Omit<HTMLAttributes<HTMLHRElement>, 'role'>

export const Divider = ({ inset, className, style, ...rest }: DividerProps) => {
  const insetStyle = inset === undefined ? undefined : { marginLeft: inset, marginRight: inset }
  return (
    <hr
      role="separator"
      className={cn(styles.root, className)}
      style={{ ...insetStyle, ...style }}
      {...rest}
    />
  )
}
