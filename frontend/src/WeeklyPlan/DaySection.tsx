import { graphql, useFragment } from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import { SectionHeader } from '../primitives/SectionHeader.tsx'
import { AddTaskDropdown } from './AddTaskDropdown.tsx'
import { WeeklyPlanRoutineSection } from './WeeklyPlanRoutineSection.tsx'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { DaySection_section$key } from './__generated__/DaySection_section.graphql.ts'
import type { DaySelection } from './days.ts'
import styles from './DaySection.module.css'

interface DaySectionProps extends DaySelection {
  label: string
  section: DaySection_section$key
  queryRef: PreloadedQuery<AddTaskDropdownQuery> | null | undefined
  connectionId: string
  onButtonHover: () => void
}

export const DaySection = ({
  label,
  section,
  dayOfWeek,
  daySection,
  queryRef,
  connectionId,
  onButtonHover,
}: DaySectionProps) => {
  const data = useFragment(
    graphql`
      fragment DaySection_section on RoutineSlotConnection {
        edges {
          __typename
        }
        ...WeeklyPlanRoutineSectionFragment
      }
    `,
    section,
  )
  const count = data.edges.length

  return (
    <section className={styles.section}>
      <SectionHeader
        title={label}
        count={count}
        dense
        action={
          <AddTaskDropdown
            queryRef={queryRef}
            dayOfWeek={dayOfWeek}
            daySection={daySection}
            connectionId={connectionId}
            onButtonHover={onButtonHover}
          />
        }
      />
      <div className={styles.headerDivider} />
      <div className={styles.body}>
        {count === 0 ? (
          <div className={styles.empty}>No tasks added</div>
        ) : (
          <WeeklyPlanRoutineSection weeklyPlanSection={data} />
        )}
      </div>
    </section>
  )
}
