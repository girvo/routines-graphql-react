import { graphql, useFragment } from 'react-relay'
import { RoutineSlotItem } from './RoutineSlotItem.tsx'
import type { WeeklyPlanRoutineSection_section$key } from './__generated__/WeeklyPlanRoutineSection_section.graphql'

interface WeeklyPlanRoutineSectionProps {
  weeklyPlanSection: WeeklyPlanRoutineSection_section$key
}

export const WeeklyPlanRoutineSection = ({
  weeklyPlanSection: weeklyPlan,
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

  return (
    <>
      {routine.edges.map(edge => (
        <RoutineSlotItem
          key={edge.node.id}
          routineSlot={edge.node}
          connectionId={routine.__id}
        />
      ))}
    </>
  )
}
