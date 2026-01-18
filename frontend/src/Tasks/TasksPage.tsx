import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { Task } from './Task'
import { Plus } from 'lucide-react'
import { useState, useMemo } from 'react'
import { CreateTask } from './CreateTask'
import { useHeaderActions } from '../utils/header-actions.ts'

interface TaskPageProps {
  queries: {
    tasksPageQuery: PreloadedQuery<TasksPageQuery>
  }
}

const TasksPage = ({ queries }: TaskPageProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const headerActions = useMemo(
    () => [
      {
        id: 'new-task',
        icon: Plus,
        label: 'New Task',
        onClick: () => setIsCreating(true),
      },
    ],
    [],
  )
  useHeaderActions(headerActions)

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
      <div className="p-4 md:px-4 md:py-0">
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
