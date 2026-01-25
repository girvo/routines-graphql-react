import { graphql, useFragment, useQueryLoader } from 'react-relay'
import { DaySection } from './DaySection.tsx'
import type { WeeklyPlanDay$key } from './__generated__/WeeklyPlanDay.graphql'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import AddTaskDropdownQueryNode from './__generated__/AddTaskDropdownQuery.graphql.ts'

interface WeeklyPlanDayProps {
  day: WeeklyPlanDay$key
}

export const WeeklyPlanDay = ({ day }: WeeklyPlanDayProps) => {
  const daySchedule = useFragment<WeeklyPlanDay$key>(
    graphql`
      fragment WeeklyPlanDay on DaySchedule {
        dayOfWeek
        morning(first: 100) {
          ...WeeklyPlanRoutineSectionFragment
        }
        midday {
          ...WeeklyPlanRoutineSectionFragment
        }
        evening {
          ...WeeklyPlanRoutineSectionFragment
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

  const handleTaskSelect = (section: string) => (taskId: string) => {
    console.log('Selected task:', taskId, 'for', daySchedule.dayOfWeek, section)
  }

  return (
    <div className="flex flex-1 flex-col gap-2 p-4 md:p-2">
      <DaySection
        label="Morning"
        sectionData={daySchedule.morning}
        queryRef={queryRef}
        onButtonHover={handleButtonHover}
        onTaskSelect={handleTaskSelect('MORNING')}
      />
      <DaySection
        label="Midday"
        sectionData={daySchedule.midday}
        queryRef={queryRef}
        onButtonHover={handleButtonHover}
        onTaskSelect={handleTaskSelect('MIDDAY')}
      />
      <DaySection
        label="Evening"
        sectionData={daySchedule.evening}
        queryRef={queryRef}
        onButtonHover={handleButtonHover}
        onTaskSelect={handleTaskSelect('EVENING')}
      />
    </div>
  )
}
