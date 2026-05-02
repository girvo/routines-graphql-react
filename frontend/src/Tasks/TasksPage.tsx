import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import { graphql, usePreloadedQuery } from 'react-relay'
import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { TasksList } from './TasksList.tsx'
import { Button } from '../primitives/Button.tsx'
import { TextInput } from '../primitives/form/TextInput.tsx'
import { usePageHeader } from '../utils/page-header.ts'
import styles from './TasksPage.module.css'

type Props = SimpleEntryPointProps<{ tasksPageQuery: TasksPageQuery }>

const TasksPage = ({ queries }: Props) => {
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const data = usePreloadedQuery<TasksPageQuery>(
    graphql`
      query TasksPageQuery {
        ...TasksList_tasks
      }
    `,
    queries.tasksPageQuery,
  )

  const actions = useMemo(
    () => (
      <>
        <Button
          variant="primary"
          size="sm"
          leadingIcon={Plus}
          onClick={() => setIsCreating(true)}
        >
          New task
        </Button>
        <TextInput
          variant="filled"
          size="sm"
          leadingIcon={Search}
          placeholder="Search tasks"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles.desktopSearch}
        />
      </>
    ),
    [searchQuery],
  )

  const belowHeader = useMemo(
    () => (
      <div className={styles.mobileSearchRow}>
        <TextInput
          variant="filled"
          size="sm"
          leadingIcon={Search}
          placeholder="Search tasks"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles.mobileSearch}
        />
      </div>
    ),
    [searchQuery],
  )

  usePageHeader({ actions, belowHeader })

  return (
    <div className={styles.page}>
      <TasksList
        tasks={data}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        searchQuery={searchQuery}
      />
    </div>
  )
}

export default TasksPage
