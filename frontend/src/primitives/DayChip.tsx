import type { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './DayChip.module.css'

type DayChipProps = {
  day: string
  selected?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export const DayChip = ({
  day,
  selected = false,
  className,
  type = 'button',
  ...rest
}: DayChipProps) => (
  <button
    type={type}
    aria-pressed={selected}
    className={clsx(styles.root, selected && styles.selected, className)}
    {...rest}
  >
    {day}
  </button>
)
