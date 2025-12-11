import { graphql } from 'relay-runtime'
import { useFragment } from 'react-relay'
import type { TaskDisplay$key } from './__generated__/TaskDisplay.graphql'
import { ListTodo, Trash2Icon } from 'lucide-react'
import { cn } from '../utils/tailwind'

interface TaskProps {
  task: TaskDisplay$key
}

const vertCentre = (input?: string) => cn('flex items-center', input)

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

  console.debug(task.slots)

  return (
    <li className="list-row">
      <div className={vertCentre()}>
        <ListTodo />
      </div>

      <div className="list-col-grow">
        <div className={vertCentre('text-lg')}>{task.title}</div>
        <div className={vertCentre('text-xs')}>
          Used {task.slots.edges.length}
          {task.slots.pageInfo.hasNextPage ?? '+'} times
        </div>
      </div>
      <div className={vertCentre()}>
        <Trash2Icon className="text-primary-content" />
      </div>
    </li>
  )
}
