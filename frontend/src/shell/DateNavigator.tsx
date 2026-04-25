import { ChevronLeft, ChevronRight, Sun } from 'lucide-react'
import { Button } from '../primitives/Button.tsx'
import styles from './DateNavigator.module.css'

type DateNavigatorProps = {
  label: string
  compactLabel: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export const DateNavigator = ({
  label,
  compactLabel,
  onPrev,
  onNext,
  onToday,
}: DateNavigatorProps) => (
  <div className={styles.root}>
    <Button
      variant="secondary"
      size="sm"
      iconOnly={ChevronLeft}
      aria-label="Previous day"
      onClick={onPrev}
      className={styles.prev}
    />
    <Button
      variant="secondary"
      size="sm"
      onClick={onToday}
      className={styles.today}
    >
      {label}
    </Button>
    <Button
      variant="secondary"
      size="sm"
      iconOnly={ChevronRight}
      aria-label="Next day"
      onClick={onNext}
      className={styles.next}
    />
    <Button
      variant="secondary"
      size="sm"
      leadingIcon={Sun}
      onClick={onToday}
      className={styles.pill}
    >
      {compactLabel}
    </Button>
  </div>
)
