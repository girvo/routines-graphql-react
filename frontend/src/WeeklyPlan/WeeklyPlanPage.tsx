import { useState } from 'react'
import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import { graphql, usePreloadedQuery } from 'react-relay'
import type { WeeklyPlanPageQuery } from './__generated__/WeeklyPlanPageQuery.graphql'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { capitalise } from '../utils/text.ts'
import { Button } from '../primitives/Button.tsx'
import { WeeklyPlanDay } from './WeeklyPlanDay.tsx'
import { WeekDaySelector } from './WeekDaySelector.tsx'
import { daySelectorToDayOfWeek, DAYS, type Day } from './days.ts'
import styles from './WeeklyPlanPage.module.css'

type Props = SimpleEntryPointProps<{ weeklyPlanPageQuery: WeeklyPlanPageQuery }>

const WeeklyPlanPage = ({ queries }: Props) => {
  const [selectedDay, setSelectedDay] = useState<Day>('monday')

  const schedule = usePreloadedQuery<WeeklyPlanPageQuery>(
    graphql`
      query WeeklyPlanPageQuery {
        weeklySchedule {
          monday {
            ...WeeklyPlanDay_day
          }
          tuesday {
            ...WeeklyPlanDay_day
          }
          wednesday {
            ...WeeklyPlanDay_day
          }
          thursday {
            ...WeeklyPlanDay_day
          }
          friday {
            ...WeeklyPlanDay_day
          }
          saturday {
            ...WeeklyPlanDay_day
          }
          sunday {
            ...WeeklyPlanDay_day
          }
        }
      }
    `,
    queries.weeklyPlanPageQuery,
  )

  const currentIndex = DAYS.indexOf(selectedDay)
  const goToPreviousDay = () =>
    setSelectedDay(DAYS[(currentIndex - 1 + DAYS.length) % DAYS.length])
  const goToNextDay = () => setSelectedDay(DAYS[(currentIndex + 1) % DAYS.length])

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
        <span className={styles.mobileTitle}>{capitalise(selectedDay)}</span>
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
          <WeekDaySelector selected={selectedDay} onSelect={setSelectedDay} />
        </aside>
        <WeeklyPlanDay
          day={schedule.weeklySchedule[selectedDay]}
          dayOfWeek={daySelectorToDayOfWeek(selectedDay)}
        />
      </div>
    </div>
  )
}

export default WeeklyPlanPage
