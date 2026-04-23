import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../utils/tailwind.ts'
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
    className={cn(styles.root, selected && styles.selected, className)}
    {...rest}
  >
    {day}
  </button>
)
