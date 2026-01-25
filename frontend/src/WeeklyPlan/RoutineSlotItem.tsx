import { graphql, useFragment } from 'react-relay'
import { DynamicIcon } from 'lucide-react/dynamic'
import { parseIconName } from '../utils/icons.ts'
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

  return (
    <div className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2">
      <DynamicIcon name={parseIconName(task.icon)} className="size-4" />
      <span>{task.title}</span>
    </div>
  )
}
