import { graphql, useFragment } from 'react-relay'
import { WeeklyPlanRoutineSection } from './WeeklyPlanRoutineSection'
import { PlusIcon } from 'lucide-react'
import type { WeeklyPlanDay$key } from './__generated__/WeeklyPlanDay.graphql'

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

  return (
    <div className="flex flex-1 flex-col gap-2 p-4 md:p-2">
      <div className="border-base-500 border p-4">
        <div className="flex">
          <h2 className="flex-1 text-2xl">Morning</h2>
          <button className="btn pr-2.5 pl-1.5">
            <PlusIcon />
            Add task
          </button>
        </div>
        <WeeklyPlanRoutineSection weeklyPlanSection={daySchedule.morning} />
      </div>
      <div className="border-base-500 border p-4">
        <div className="flex">
          <h2 className="flex-1 text-2xl">Midday</h2>
          <button className="btn pr-2.5 pl-1.5">
            <PlusIcon />
            Add task
          </button>
        </div>
        <WeeklyPlanRoutineSection weeklyPlanSection={daySchedule.midday} />
      </div>
      <div className="border-base-500 border p-4">
        <div className="flex">
          <h2 className="flex-1 text-2xl">Evening</h2>
          <button className="btn pr-2.5 pl-1.5">
            <PlusIcon />
            Add task
          </button>
        </div>
        <WeeklyPlanRoutineSection weeklyPlanSection={daySchedule.evening} />
      </div>
    </div>
  )
}
