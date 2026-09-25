import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import { graphql, usePreloadedQuery } from 'react-relay'
import { useState } from 'react'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { TasksList } from './TasksList.tsx'
import styles from './TasksPage.module.css'

type Props = SimpleEntryPointProps<{ tasksPageQuery: TasksPageQuery }>

const TasksPage = ({ queries }: Props) => {
  const [isCreating, setIsCreating] = useState(false)

  const data = usePreloadedQuery<TasksPageQuery>(
    graphql`
      query TasksPageQuery {
        ...TasksList_tasks
      }
    `,
    queries.tasksPageQuery,
  )

  return (
    <div className={styles.page}>
      <TasksList
        tasks={data}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
      />
    </div>
  )
}

export default TasksPage
