import { useQueryLoader } from 'react-relay'
import { DaySection } from './DaySection.tsx'
import type { DaySection_section$key } from './__generated__/DaySection_section.graphql.ts'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import AddTaskDropdownQueryNode from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { DayOfWeek } from './days.ts'
import styles from './WeeklyPlanDay.module.css'

interface WeeklyPlanDayProps {
  dayOfWeek: DayOfWeek
  morning: DaySection_section$key
  midday: DaySection_section$key
  evening: DaySection_section$key
}

export const WeeklyPlanDay = ({
  dayOfWeek,
  morning,
  midday,
  evening,
}: WeeklyPlanDayProps) => {
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
        section={morning}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MORNING"
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Midday"
        section={midday}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MIDDAY"
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Evening"
        section={evening}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="EVENING"
        onButtonHover={handleButtonHover}
      />
    </div>
  )
}
