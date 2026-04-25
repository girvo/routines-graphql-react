import { graphql, useFragment } from 'react-relay'
import { PlannerSlot } from './PlannerSlot.tsx'
import type { RoutineSlotItem$key } from './__generated__/RoutineSlotItem.graphql.ts'

interface RoutineSlotItemProps {
  task: RoutineSlotItem$key
}

export const RoutineSlotItem = ({ task: taskRef }: RoutineSlotItemProps) => {
  const task = useFragment(
    graphql`
      fragment RoutineSlotItem on Task {
        id
        title
        icon
      }
    `,
    taskRef,
  )

  return <PlannerSlot title={task.title} icon={task.icon} />
}
