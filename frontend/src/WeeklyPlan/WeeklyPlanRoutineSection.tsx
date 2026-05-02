import { graphql, useFragment } from 'react-relay'
import { RoutineSlotItem } from './RoutineSlotItem.tsx'
import type { WeeklyPlanRoutineSectionFragment$key } from './__generated__/WeeklyPlanRoutineSectionFragment.graphql'

interface WeeklyPlanRoutineSectionProps {
  weeklyPlanSection: WeeklyPlanRoutineSectionFragment$key
}

export const WeeklyPlanRoutineSection = ({
  weeklyPlanSection: weeklyPlan,
}: WeeklyPlanRoutineSectionProps) => {
  const routine = useFragment<WeeklyPlanRoutineSectionFragment$key>(
    graphql`
      fragment WeeklyPlanRoutineSectionFragment on RoutineSlotConnection {
        __id
        edges {
          node {
            id
            ...RoutineSlotItem
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
