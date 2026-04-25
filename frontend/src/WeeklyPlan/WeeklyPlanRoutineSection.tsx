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
        edges {
          node {
            id
            task {
              ...RoutineSlotItem
            }
          }
        }
      }
    `,
    weeklyPlan,
  )

  return (
    <>
      {routine.edges.map((edge) => (
        <RoutineSlotItem key={edge.node.id} task={edge.node.task} />
      ))}
    </>
  )
}
