import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import { graphql, usePreloadedQuery } from 'react-relay'
import { useNavigate } from 'react-router-dom'
import type { WeeklyPlanPageQuery } from './__generated__/WeeklyPlanPageQuery.graphql'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { capitalise } from '../utils/text.ts'
import { Button } from '../primitives/Button.tsx'
import { WeeklyPlanDay } from './WeeklyPlanDay.tsx'
import { WeekDaySelector } from './WeekDaySelector.tsx'
import { daySelectorToDayOfWeek, DAYS, type Day } from './days.ts'
import styles from './WeeklyPlanPage.module.css'

type Props = SimpleEntryPointProps<
  { weeklyPlanPageQuery: WeeklyPlanPageQuery },
  { day: Day }
>

const WeeklyPlanPage = ({ queries, extraProps: { day } }: Props) => {
  const data = usePreloadedQuery<WeeklyPlanPageQuery>(
    graphql`
      query WeeklyPlanPageQuery($dayOfWeek: DayOfWeek!) {
        ...WeeklyPlanDay_sections @arguments(dayOfWeek: $dayOfWeek)
      }
    `,
    queries.weeklyPlanPageQuery,
  )

  const navigate = useNavigate()
  const selectDay = (next: Day) => navigate(`/weekly/${next}`)

  const currentIndex = DAYS.indexOf(day)
  const goToPreviousDay = () =>
    selectDay(DAYS[(currentIndex - 1 + DAYS.length) % DAYS.length])
  const goToNextDay = () => selectDay(DAYS[(currentIndex + 1) % DAYS.length])

  return (
    <div className={styles.page}>
      <div className={styles.mobileHeader}>
        <Button
          variant="ghost"
          size="sm"
          iconOnly={ChevronLeft}
          aria-label="Previous day"
          onClick={goToPreviousDay}
        />
        <span className={styles.mobileTitle}>{capitalise(day)}</span>
        <Button
          variant="ghost"
          size="sm"
          iconOnly={ChevronRight}
          aria-label="Next day"
          onClick={goToNextDay}
        />
      </div>
      <div className={styles.body}>
        <aside className={styles.selector}>
          <WeekDaySelector selected={day} onSelect={selectDay} />
        </aside>
        <WeeklyPlanDay
          dayOfWeek={daySelectorToDayOfWeek(day)}
          sections={data}
        />
      </div>
    </div>
  )
}

export default WeeklyPlanPage
