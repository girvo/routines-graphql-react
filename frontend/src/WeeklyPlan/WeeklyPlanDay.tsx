import { graphql, useFragment, useQueryLoader } from 'react-relay'
import { WeeklyPlanRoutineSection } from './WeeklyPlanRoutineSection.tsx'
import { AddTaskDropdown } from './AddTaskDropdown.tsx'
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
    loadQuery({ titleSearch: null })
  }

  const handleTaskSelect = (section: string) => (taskId: string) => {
    console.log('Selected task:', taskId, 'for', daySchedule.dayOfWeek, section)
  }

  return (
    <div className="flex flex-1 flex-col gap-2 p-4 md:p-2">
      <div className="border-base-500 border p-4">
        <div className="flex">
          <h2 className="flex-1 text-2xl">Morning</h2>
          <AddTaskDropdown
            queryRef={queryRef}
            loadQuery={loadQuery}
            onButtonHover={handleButtonHover}
            onTaskSelect={handleTaskSelect('MORNING')}
          />
        </div>
        <WeeklyPlanRoutineSection weeklyPlanSection={daySchedule.morning} />
      </div>
      <div className="border-base-500 border p-4">
        <div className="flex">
          <h2 className="flex-1 text-2xl">Midday</h2>
          <AddTaskDropdown
            queryRef={queryRef}
            loadQuery={loadQuery}
            onButtonHover={handleButtonHover}
            onTaskSelect={handleTaskSelect('MIDDAY')}
          />
        </div>
        <WeeklyPlanRoutineSection weeklyPlanSection={daySchedule.midday} />
      </div>
      <div className="border-base-500 border p-4">
        <div className="flex">
          <h2 className="flex-1 text-2xl">Evening</h2>
          <AddTaskDropdown
            queryRef={queryRef}
            loadQuery={loadQuery}
            onButtonHover={handleButtonHover}
            onTaskSelect={handleTaskSelect('EVENING')}
          />
        </div>
        <WeeklyPlanRoutineSection weeklyPlanSection={daySchedule.evening} />
      </div>
    </div>
  )
}
