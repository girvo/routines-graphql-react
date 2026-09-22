import { graphql, useFragment } from 'react-relay'
import { RoutineSlotItem } from './RoutineSlotItem.tsx'
import { useDaySectionMoveTask } from './DaySectionMoveTask.ts'
import type { DayOfWeek } from './days.ts'
import type { WeeklyPlanRoutineSection_section$key } from './__generated__/WeeklyPlanRoutineSection_section.graphql'

interface WeeklyPlanRoutineSectionProps {
  weeklyPlanSection: WeeklyPlanRoutineSection_section$key
  dayOfWeek: DayOfWeek
}

export const WeeklyPlanRoutineSection = ({
  weeklyPlanSection: weeklyPlan,
  dayOfWeek,
}: WeeklyPlanRoutineSectionProps) => {
  const routine = useFragment<WeeklyPlanRoutineSection_section$key>(
    graphql`
      fragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {
        __id
        edges {
          node {
            id
            ...RoutineSlotItem_routineSlot
          }
        }
      }
    `,
    weeklyPlan,
  )

  const slotIds = routine.edges.map(edge => edge.node.id)
  const { moveSlot, isMoving } = useDaySectionMoveTask({
    connectionId: routine.__id,
    slotIds,
    dayOfWeek,
  })

  return (
    <>
      {routine.edges.map(edge => (
        <RoutineSlotItem
          key={edge.node.id}
          routineSlot={edge.node}
          connectionId={routine.__id}
          move={{ slotIds, moveSlot, isMoving }}
        />
      ))}
    </>
  )
}
