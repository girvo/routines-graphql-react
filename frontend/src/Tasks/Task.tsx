import { graphql } from 'relay-runtime'
import { useFragment } from 'react-relay'
import type { TaskDisplay$key } from './__generated__/TaskDisplay.graphql'
import { ListTodo, MoreVertical } from 'lucide-react'

interface TaskProps {
  task: TaskDisplay$key
}

export const Task = ({ task: taskData }: TaskProps) => {
  const task = useFragment(
    graphql`
      fragment TaskDisplay on Task {
        id
        title
        createdAt
        slots {
          edges {
            node {
              __typename
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
    taskData,
  )

  const slotCount = task.slots.edges.length
  const hasMore = task.slots.pageInfo.hasNextPage

  return (
    <div className="bg-neutral text-neutral-content flex w-full items-center gap-3 rounded-full p-2 pr-4 shadow-sm">
      <div className="bg-neutral-content text-neutral flex size-12 shrink-0 items-center justify-center rounded-full">
        <ListTodo className="size-6" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-base font-medium">{task.title}</span>
        <span className="text-sm opacity-70">
          {slotCount}
          {hasMore ? '+' : ''} slot{slotCount !== 1 ? 's' : ''}
        </span>
      </div>

      <button className="btn btn-ghost btn-circle btn-sm text-neutral-content">
        <MoreVertical className="size-5" />
      </button>
    </div>
  )
}
