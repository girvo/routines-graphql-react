import { graphql, usePaginationFragment } from 'react-relay'
import { ConnectionHandler, ROOT_ID } from 'relay-runtime'
import {
  startTransition,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { Plus, Search } from 'lucide-react'
import { Task } from './Task.tsx'
import { CreateTask } from './CreateTask.tsx'
import { Button } from '../primitives/Button.tsx'
import { TextInput } from '../primitives/form/TextInput.tsx'
import { Card } from '../primitives/layout/Card.tsx'
import { TasksTableHeader } from './TasksTableHeader.tsx'
import { usePageHeader } from '../utils/page-header.ts'
import type { TasksList_tasks$key } from './__generated__/TasksList_tasks.graphql'
import type { TasksListPaginationQuery } from './__generated__/TasksListPaginationQuery.graphql'
import styles from './TasksList.module.css'

interface TasksListProps {
  tasks: TasksList_tasks$key
  isCreating: boolean
  setIsCreating: Dispatch<SetStateAction<boolean>>
}

export const TasksList = ({
  tasks: tasksRef,
  isCreating,
  setIsCreating,
}: TasksListProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data, loadNext, hasNext, isLoadingNext, refetch } =
    usePaginationFragment<TasksListPaginationQuery, TasksList_tasks$key>(
      graphql`
        fragment TasksList_tasks on Query
        @refetchable(queryName: "TasksListPaginationQuery")
        @argumentDefinitions(
          count: { type: "NonNegativeInt", defaultValue: 20 }
          cursor: { type: "String" }
          titleSearch: { type: "String", defaultValue: null }
        ) {
          tasks(first: $count, after: $cursor, titleSearch: $titleSearch)
            @connection(key: "TasksList_tasks") {
            __id
            edges {
              node {
                id
                ...Task_task
                # eslint-disable-next-line relay/must-colocate-fragment-spreads
                ...EditTask_task
              }
            }
          }
        }
      `,
      tasksRef,
    )

  const refetchByTitle = useCallback(
    (titleSearch: string | null) => {
      startTransition(() => {
        refetch({ titleSearch }, { fetchPolicy: 'store-and-network' })
      })
    },
    [refetch],
  )
  const debouncedRefetchByTitle = useDebounceCallback(refetchByTitle, 300)

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      setSearchQuery(next)
      debouncedRefetchByTitle(next.trim() ? next : null)
    },
    [debouncedRefetchByTitle],
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
          onChange={handleSearchChange}
          className={styles.desktopSearch}
        />
      </>
    ),
    [searchQuery, handleSearchChange, setIsCreating],
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
          onChange={handleSearchChange}
          className={styles.mobileSearch}
        />
      </div>
    ),
    [searchQuery, handleSearchChange],
  )

  const loadedCount = data.tasks.edges.length
  const subtitle = hasNext ? `${loadedCount}+ total` : `${loadedCount} total`
  usePageHeader({ subtitle, actions, belowHeader })

  const showEmpty = data.tasks.edges.length === 0 && !isCreating

  return (
    <Card responsive>
      <TasksTableHeader />
      {isCreating && (
        <CreateTask
          setIsCreating={setIsCreating}
          connectionIds={[
            data.tasks.__id,
            ConnectionHandler.getConnectionID(ROOT_ID, 'TasksList_tasks'),
          ]}
        />
      )}
      {showEmpty && (
        <div className={styles.empty}>
          {searchQuery.trim()
            ? `No tasks match "${searchQuery}"`
            : 'No tasks, create some!'}
        </div>
      )}
      {data.tasks.edges.map(({ node }) => (
        <Task
          key={node.id}
          task={node}
          updatable={node}
          connectionId={data.tasks.__id}
        />
      ))}
      {hasNext && !searchQuery.trim() && (
        <div className={styles.loadMore}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              startTransition(() => {
                loadNext(20)
              })
            }}
            loading={isLoadingNext}
          >
            Load more
          </Button>
        </div>
      )}
    </Card>
  )
}
