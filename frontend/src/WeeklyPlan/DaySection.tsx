import { graphql, useFragment } from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import { SectionHeader } from '../primitives/layout/SectionHeader.tsx'
import { AddTaskDropdown } from './AddTaskDropdown.tsx'
import { WeeklyPlanRoutineSection } from './WeeklyPlanRoutineSection.tsx'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { DaySection_section$key } from './__generated__/DaySection_section.graphql.ts'
import type { DaySelection } from './days.ts'
import { pluralise } from '../utils/text.ts'
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
      <div className={styles.desktopHeader}>
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
      </div>
      <div className={styles.mobileHeader}>
        <span className={styles.mobileLabel}>{label}</span>
        <span className={styles.mobileCount}>
          {count} {pluralise(count, 'task', 'tasks')}
        </span>
      </div>
      <div className={styles.headerDivider} />
      <div className={styles.body}>
        {count === 0 && <div className={styles.empty}>No tasks added</div>}
        {count > 0 && <WeeklyPlanRoutineSection weeklyPlanSection={data} />}
        <div className={styles.mobileAddRow}>
          <AddTaskDropdown
            variant="row"
            queryRef={queryRef}
            dayOfWeek={dayOfWeek}
            daySection={daySection}
            connectionId={connectionId}
            onButtonHover={onButtonHover}
          />
        </div>
      </div>
    </section>
  )
}
