import { graphql, useFragment, useQueryLoader } from 'react-relay'
import { DaySection } from './DaySection.tsx'
import type { WeeklyPlanDay$key } from './__generated__/WeeklyPlanDay.graphql'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import AddTaskDropdownQueryNode from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { DayOfWeek } from './days.ts'

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
          # This feels like a hack... not sure I should be doing it this way?
          edges {
            cursor
          }
          ...WeeklyPlanRoutineSectionFragment
        }
        midday(first: 100) @connection(key: "WeeklyPlanDaySlots_midday") {
          __id
          edges {
            cursor
          }
          ...WeeklyPlanRoutineSectionFragment
        }
        evening(first: 100) @connection(key: "WeeklyPlanDaySlots_evening") {
          __id
          edges {
            cursor
          }
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

  return (
    <div className="flex flex-1 flex-col gap-2 self-center p-4 md:max-w-5xl md:p-2">
      <DaySection
        label="Morning"
        sectionData={daySchedule.morning}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MORNING"
        connectionId={daySchedule.morning.__id}
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Midday"
        sectionData={daySchedule.midday}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="MIDDAY"
        connectionId={daySchedule.midday.__id}
        onButtonHover={handleButtonHover}
      />
      <DaySection
        label="Evening"
        sectionData={daySchedule.evening}
        queryRef={queryRef}
        dayOfWeek={dayOfWeek}
        daySection="EVENING"
        connectionId={daySchedule.evening.__id}
        onButtonHover={handleButtonHover}
      />
    </div>
  )
}
