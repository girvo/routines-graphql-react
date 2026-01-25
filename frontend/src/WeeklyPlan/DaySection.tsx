import { Card, CardBody } from '../primitives/Card.tsx'
import { SectionHeader } from '../primitives/SectionHeader.tsx'
import { AddTaskDropdown } from './AddTaskDropdown.tsx'
import { WeeklyPlanRoutineSection } from './WeeklyPlanRoutineSection.tsx'
import type { PreloadedQuery, LoadQueryOptions } from 'react-relay'
import type { AddTaskDropdownQuery, AddTaskDropdownQuery$variables } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { WeeklyPlanRoutineSectionFragment$key } from './__generated__/WeeklyPlanRoutineSectionFragment.graphql.ts'

interface DaySectionProps {
  label: string
  sectionData: WeeklyPlanRoutineSectionFragment$key
  queryRef: PreloadedQuery<AddTaskDropdownQuery> | null | undefined
  loadQuery: (variables: AddTaskDropdownQuery$variables, options?: LoadQueryOptions) => void
  onButtonHover: () => void
  onTaskSelect: (taskId: string) => void
}

export const DaySection = ({
  label,
  sectionData,
  queryRef,
  loadQuery,
  onButtonHover,
  onTaskSelect,
}: DaySectionProps) => (
  <Card>
    <CardBody>
      <SectionHeader
        title={label}
        action={
          <AddTaskDropdown
            queryRef={queryRef}
            loadQuery={loadQuery}
            onButtonHover={onButtonHover}
            onTaskSelect={onTaskSelect}
          />
        }
      />
      <WeeklyPlanRoutineSection weeklyPlanSection={sectionData} />
    </CardBody>
  </Card>
)
