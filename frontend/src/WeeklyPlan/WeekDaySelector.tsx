import { capitalise } from '../utils/text.ts'
import { clsx } from 'clsx'
import { DAYS, type Day } from './days.ts'
import styles from './WeekDaySelector.module.css'

interface WeekDaySelectorProps {
  selected: Day
  onSelect: (day: Day) => void
  counts?: Partial<Record<Day, number>>
}

export const WeekDaySelector = ({ selected, onSelect, counts }: WeekDaySelectorProps) => (
  <nav className={styles.root} aria-label="Days of the week">
    <div className={styles.heading}>Days</div>
    {DAYS.map((day) => {
      const isActive = day === selected
      const count = counts?.[day]
      return (
        <button
          key={day}
          type="button"
          className={clsx(styles.day, isActive && styles.active)}
          onClick={() => onSelect(day)}
          aria-current={isActive ? 'page' : undefined}
        >
          <span className={styles.dl}>
            <span className={styles.dot} aria-hidden />
            <span className={styles.name}>{capitalise(day)}</span>
          </span>
          {count !== undefined && <span className={styles.count}>{count}</span>}
        </button>
      )
    })}
  </nav>
)
