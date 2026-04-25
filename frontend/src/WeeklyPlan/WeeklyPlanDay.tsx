import { graphql, useFragment, useQueryLoader } from 'react-relay'
import { DaySection } from './DaySection.tsx'
import type { WeeklyPlanDay$key } from './__generated__/WeeklyPlanDay.graphql'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import AddTaskDropdownQueryNode from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { DayOfWeek } from './days.ts'
import styles from './WeeklyPlanDay.module.css'

interface WeeklyPlanDayProps {
  day: WeeklyPlanDay$key
  dayOfWeek: DayOfWeek
}

export const WeeklyPlanDay = ({ day, dayOfWeek }: WeeklyPlanDayProps) => {
  const daySchedule = useFragment<WeeklyPlanDay$key>(
    graphql`
      fragment WeeklyPlanDay on DaySchedule {
        dayOfWeek
        morning(first: 100) @connection(key: "WeeklyPlanDaySlots_morning") {
          __id
          edges {
            cursor
          }
          ...DaySection_section
        }
        midday(first: 100) @connection(key: "WeeklyPlanDaySlots_midday") {
          __id
          edges {
            cursor
          }
          ...DaySection_section
        }
        evening(first: 100) @connection(key: "WeeklyPlanDaySlots_evening") {
          __id
          edges {
            cursor
          }
          ...DaySection_section
        }
      }
    `,
    day,
  )

  const [queryRef, loadQuery] = useQueryLoader<AddTaskDropdownQuery>(
    AddTaskDropdownQueryNode,
  )

  const handleButtonHover = () => {
    if (!queryRef) {
      loadQuery({})
    }
  }

  return (
    <div className={styles.day}>
      <DaySection
        label="Morning"
        section={daySchedule.morning}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MORNING"
        connectionId={daySchedule.morning.__id}
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Midday"
        section={daySchedule.midday}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MIDDAY"
        connectionId={daySchedule.midday.__id}
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Evening"
        section={daySchedule.evening}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="EVENING"
        connectionId={daySchedule.evening.__id}
        onButtonHover={handleButtonHover}
      />
    </div>
  )
}
