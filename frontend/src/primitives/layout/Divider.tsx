import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './Divider.module.css'

type DividerProps = {
  inset?: number
} & Omit<HTMLAttributes<HTMLHRElement>, 'role'>

export const Divider = ({ inset, className, style, ...rest }: DividerProps) => {
  const insetStyle = inset === undefined ? undefined : { marginLeft: inset, marginRight: inset }
  return (
    <hr
      role="separator"
      className={clsx(styles.root, className)}
      style={{ ...insetStyle, ...style }}
      {...rest}
    />
  )
}
