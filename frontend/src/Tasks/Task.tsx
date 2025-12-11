import { graphql } from 'relay-runtime'
import { useFragment } from 'react-relay'
import type { TaskDisplay$key } from './__generated__/TaskDisplay.graphql'

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
      }
    `,
    taskData,
  )

  return (
    <li className="list-row">
      <div>{task.id}</div>
      <div className="text-lg">{task.title}</div>
    </li>
  )
}
