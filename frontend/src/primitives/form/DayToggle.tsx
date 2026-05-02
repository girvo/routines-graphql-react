import type { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './DayToggle.module.css'

type DayToggleProps = {
  day: string
  selected?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export const DayToggle = ({
  day,
  selected = false,
  className,
  type = 'button',
  ...rest
}: DayToggleProps) => (
  <button
    type={type}
    aria-pressed={selected}
    className={clsx(styles.root, selected && styles.selected, className)}
    {...rest}
  >
    {day}
  </button>
)
