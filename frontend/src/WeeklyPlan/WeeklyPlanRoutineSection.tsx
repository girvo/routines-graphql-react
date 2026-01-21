import { graphql, useFragment } from 'react-relay'
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
            createdAt
            section
            task {
              ...TaskDisplay
            }
          }
        }
      }
    `,
    weeklyPlan,
  )

  if (routine.edges.length === 0) {
    return <div className="text-md flex text-center">No tasks addded</div>
  }

  return (
    <div className="flex flex-row">
      {routine.edges.map(edge => {
        return <div key={edge.node.id}>{edge.node.id}</div>
      })}
    </div>
  )
}
