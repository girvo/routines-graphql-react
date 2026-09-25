import { graphql, useFragment, useQueryLoader } from 'react-relay'
import { DaySection } from './DaySection.tsx'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import AddTaskDropdownQueryNode from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { DayOfWeek } from './days.ts'
import type { WeeklyPlanDay_sections$key } from './__generated__/WeeklyPlanDay_sections.graphql.ts'
import styles from './WeeklyPlanDay.module.css'

interface WeeklyPlanDayProps {
  dayOfWeek: DayOfWeek
  sections: WeeklyPlanDay_sections$key
}

export const WeeklyPlanDay = ({ dayOfWeek, sections }: WeeklyPlanDayProps) => {
  const data = useFragment(
    graphql`
      fragment WeeklyPlanDay_sections on Query
      @argumentDefinitions(dayOfWeek: { type: "DayOfWeek!" }) {
        morning: daySectionSlots(dayOfWeek: $dayOfWeek, section: MORNING) {
          ...DaySection_section
        }
        midday: daySectionSlots(dayOfWeek: $dayOfWeek, section: MIDDAY) {
          ...DaySection_section
        }
        evening: daySectionSlots(dayOfWeek: $dayOfWeek, section: EVENING) {
          ...DaySection_section
        }
      }
    `,
    sections,
  )

  const [queryRef, loadQuery] = useQueryLoader<AddTaskDropdownQuery>(
    AddTaskDropdownQueryNode,
  )

  const handleButtonHover = () => {
    if (!queryRef) {
      loadQuery({}, { fetchPolicy: 'store-and-network' })
    }
  }

  return (
    <div className={styles.day}>
      <DaySection
        label="Morning"
        section={data.morning}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MORNING"
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Midday"
        section={data.midday}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MIDDAY"
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Evening"
        section={data.evening}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="EVENING"
        onButtonHover={handleButtonHover}
      />
    </div>
  )
}
