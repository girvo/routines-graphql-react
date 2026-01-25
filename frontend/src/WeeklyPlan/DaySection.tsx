import { Card, CardBody } from '../primitives/Card.tsx'
import { SectionHeader } from '../primitives/SectionHeader.tsx'
import { AddTaskDropdown } from './AddTaskDropdown.tsx'
import { WeeklyPlanRoutineSection } from './WeeklyPlanRoutineSection.tsx'
import type { PreloadedQuery } from 'react-relay'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { WeeklyPlanRoutineSectionFragment$key } from './__generated__/WeeklyPlanRoutineSectionFragment.graphql.ts'
import type { DaySelection } from './days.ts'

interface DaySectionProps extends DaySelection {
  label: string
  sectionData: WeeklyPlanRoutineSectionFragment$key
  queryRef: PreloadedQuery<AddTaskDropdownQuery> | null | undefined
  connectionId: string
  onButtonHover: () => void
}

export const DaySection = ({
  label,
  sectionData,
  dayOfWeek,
  daySection,
  queryRef,
  connectionId,
  onButtonHover,
}: DaySectionProps) => (
  <Card>
    <CardBody>
      <SectionHeader
        title={label}
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
      <WeeklyPlanRoutineSection weeklyPlanSection={sectionData} />
    </CardBody>
  </Card>
)
