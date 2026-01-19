import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { TasksList } from './TasksList'
import { Plus } from 'lucide-react'
import { useState, useMemo } from 'react'
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
        ...TasksList_tasks
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
          <TasksList
            tasks={data}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        </table>
      </div>
    </>
  )
}

export default TasksPage
