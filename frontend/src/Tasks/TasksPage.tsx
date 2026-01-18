import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { Task } from './Task'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { CreateTask } from './CreateTask'

console.debug('I am loaded!')

interface TaskPageProps {
  queries: {
    tasksPageQuery: PreloadedQuery<TasksPageQuery>
  }
}

asdlkjasd()

const TasksPage = ({ queries }: TaskPageProps) => {
  const [isCreating, setIsCreating] = useState(false)

  const data = usePreloadedQuery<TasksPageQuery>(
    graphql`
      query TasksPageQuery {
        tasks(first: 100) @connection(key: "All_tasks") {
          __id
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
        <button
          className="btn items-center"
          onClick={() => setIsCreating(true)}
        >
          <PlusIcon className="h-4 w-4 translate-y-px" />
          New
        </button>
      </div>
      <div className="p-4 md:p-0">
        <table className="w-full border-separate border-spacing-y-3 md:table md:table-fixed md:border-spacing-0">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="w-1/4">Task name</th>
              <th className="w-1/4">Icon</th>
              <th className="w-1/4">Used in</th>
              <th className="w-1/4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="block space-y-3 md:table-row-group md:space-y-0">
            {data.tasks.edges.length === 0 && !isCreating && (
              <tr>
                <td className="text-center" colSpan={4}>
                  No tasks, create some!
                </td>
              </tr>
            )}
            {isCreating && (
              <CreateTask
                setIsCreating={setIsCreating}
                connectionId={data.tasks.__id}
              />
            )}
            {data.tasks.edges.map(({ node }) => {
              return (
                <Task
                  key={node.id}
                  task={node}
                  connectionId={data.tasks.__id}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TasksPage
