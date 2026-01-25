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

  if (routine.edges.length === 0) {
    return <div className="text-base-content/50 py-2">No tasks added</div>
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {routine.edges.map(edge => (
        <RoutineSlotItem key={edge.node.id} task={edge.node.task} />
      ))}
    </div>
  )
}
