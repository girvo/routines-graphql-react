import { graphql } from 'relay-runtime'
import { useFragment } from 'react-relay'
import type { TaskDisplay$key } from './__generated__/TaskDisplay.graphql'
import { ListTodo, Pencil, Trash2 } from 'lucide-react'

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
  const slotText = `${slotCount}${hasMore ? '+' : ''}`

  return (
    <tr className="bg-base-200 block rounded-lg md:table-row md:rounded-none md:bg-transparent">
      {/* Task name - visible on both, with icon on mobile */}
      <td className="block p-4 pb-2 md:table-cell md:p-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-content flex size-10 shrink-0 items-center justify-center rounded-lg md:hidden">
            <ListTodo className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{task.title}</span>
            <span className="text-sm opacity-70 md:hidden">
              used in {slotText} slot{slotCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </td>

      {/* Icon column - desktop only */}
      <td className="hidden md:table-cell md:p-3">
        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded">
          <ListTodo className="size-4" />
        </div>
      </td>

      {/* Slots column - desktop only */}
      <td className="hidden md:table-cell md:p-3">
        {slotText} slot{slotCount !== 1 ? 's' : ''}
      </td>

      {/* Actions */}
      <td className="border-base-300 block border-t p-0 md:table-cell md:border-t-0 md:p-3">
        <div className="flex md:gap-1">
          <button className="btn btn-ghost btn-sm text-error flex-1 rounded-none rounded-bl-lg md:flex-none md:rounded">
            <Trash2 className="size-4" />
            <span className="md:hidden">Del</span>
          </button>
          <button className="btn btn-ghost btn-sm flex-1 rounded-none rounded-br-lg md:flex-none md:rounded">
            <Pencil className="size-4" />
            <span className="md:hidden">Edit</span>
          </button>
        </div>
      </td>
    </tr>
  )
}
