import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { Task } from './Task'
import { PlusIcon } from 'lucide-react'

console.debug('I am loaded!')

interface TaskPageProps {
  queries: {
    tasksPageQuery: PreloadedQuery<TasksPageQuery>
  }
}

const TasksPage = ({ queries }: TaskPageProps) => {
  const data = usePreloadedQuery<TasksPageQuery>(
    graphql`
      query TasksPageQuery {
        tasks {
          edges {
            node {
              id
              ...TaskDisplay
            }
          }
        }
      }
    `,
    queries.tasksPageQuery,
  )

  return (
    <>
      <div className="navbar bg-base-300 pr-4 pl-4">
        <div className="flex-1 text-xl">All tasks</div>
        <button className="btn items-center">
          <PlusIcon className="h-4 w-4 translate-y-px" />
          New
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <table className="table">
          <thead>
            <tr>
              <th>Task name</th>
              <th>Icon</th>
              <th>Slots</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.tasks.edges.map(({ node }) => {
              return <Task key={node.id} task={node} />
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TasksPage
