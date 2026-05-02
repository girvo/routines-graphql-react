import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { clsx } from 'clsx'
import { Popover, PopoverContent, PopoverTrigger } from '../overlay/popover/Popover.tsx'
import { Button } from '../Button.tsx'
import styles from './DatePicker.module.css'

interface DatePickerProps {
  value: Date | null
  onChange: (value: Date) => void
  placeholder?: string
  disabled?: boolean
  'aria-label'?: string
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick date',
  disabled,
  'aria-label': ariaLabel,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value ?? new Date()))

  const today = startOfDay(new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewMonth)),
    end: endOfWeek(endOfMonth(viewMonth)),
  })

  const nextMonthDisabled = isAfter(startOfMonth(addMonths(viewMonth, 1)), today)

  const handleSelect = (day: Date) => {
    onChange(day)
    setOpen(false)
  }

  const handleJumpToToday = () => {
    setViewMonth(startOfMonth(today))
    handleSelect(today)
  }

  const isTodaySelected = value !== null && isSameDay(value, today)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="secondary"
          size="sm"
          leadingIcon={Calendar}
          disabled={disabled}
          aria-label={ariaLabel ?? 'Pick date'}
        >
          {value ? format(value, 'MMM d, yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={styles.popover}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.nav}
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className={styles.navIcon} />
          </button>
          <span className={styles.monthLabel}>{format(viewMonth, 'MMMM yyyy')}</span>
          <button
            type="button"
            className={styles.nav}
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            disabled={nextMonthDisabled}
            aria-label="Next month"
          >
            <ChevronRight className={styles.navIcon} />
          </button>
        </div>
        <div className={styles.weekdays} aria-hidden>
          {WEEKDAY_LABELS.map((label, idx) => (
            <span key={idx} className={styles.weekday}>
              {label}
            </span>
          ))}
        </div>
        <div className={styles.grid} role="grid">
          {days.map((day) => {
            const isFuture = isAfter(day, today)
            const isSelected = value !== null && isSameDay(day, value)
            const isOutsideMonth = !isSameMonth(day, viewMonth)
            return (
              <button
                key={day.toISOString()}
                type="button"
                role="gridcell"
                className={clsx(
                  styles.day,
                  isSelected && styles.selected,
                  isOutsideMonth && styles.outsideMonth,
                )}
                onClick={() => handleSelect(day)}
                disabled={isFuture}
                aria-label={format(day, 'PPPP')}
                aria-pressed={isSelected}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.todayButton}
            onClick={handleJumpToToday}
            disabled={isTodaySelected}
          >
            Today
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
