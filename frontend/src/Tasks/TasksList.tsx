import { graphql, usePaginationFragment } from 'react-relay'
import { useMemo, type Dispatch, type SetStateAction } from 'react'
import { Task } from './Task.tsx'
import { CreateTask } from './CreateTask.tsx'
import { Button } from '../primitives/Button.tsx'
import { TasksTableHeader } from './TasksTableHeader.tsx'
import { usePageHeader } from '../utils/page-header.ts'
import type { TasksList_tasks$key } from './__generated__/TasksList_tasks.graphql'
import styles from './TasksList.module.css'

interface TasksListProps {
  tasks: TasksList_tasks$key
  isCreating: boolean
  setIsCreating: Dispatch<SetStateAction<boolean>>
  searchQuery: string
}

export const TasksList = ({
  tasks: tasksRef,
  isCreating,
  setIsCreating,
  searchQuery,
}: TasksListProps) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment TasksList_tasks on Query
      @refetchable(queryName: "TasksListPaginationQuery")
      @argumentDefinitions(
        count: { type: "NonNegativeInt", defaultValue: 20 }
        cursor: { type: "String" }
      ) {
        tasks(first: $count, after: $cursor)
          @connection(key: "TasksList_tasks") {
          __id
          edges {
            node {
              id
              title
              ...TaskDisplay
              ...EditTaskUpdatable
            }
          }
        }
      }
    `,
    tasksRef,
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const visibleEdges = useMemo(() => {
    if (!normalizedQuery) return data.tasks.edges
    return data.tasks.edges.filter(({ node }) =>
      node.title.toLowerCase().includes(normalizedQuery),
    )
  }, [data.tasks.edges, normalizedQuery])

  const loadedCount = data.tasks.edges.length
  const subtitle = hasNext ? `${loadedCount}+ total` : `${loadedCount} total`
  usePageHeader({ subtitle })

  const showEmpty = visibleEdges.length === 0 && !isCreating

  return (
    <div className={styles.card}>
      <TasksTableHeader />
      {isCreating && (
        <CreateTask setIsCreating={setIsCreating} connectionId={data.tasks.__id} />
      )}
      {showEmpty && (
        <div className={styles.empty}>
          {normalizedQuery
            ? `No tasks match "${searchQuery}"`
            : 'No tasks, create some!'}
        </div>
      )}
      {visibleEdges.map(({ node }) => (
        <Task
          key={node.id}
          task={node}
          updatable={node}
          connectionId={data.tasks.__id}
        />
      ))}
      {hasNext && !normalizedQuery && (
        <div className={styles.loadMore}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => loadNext(20)}
            loading={isLoadingNext}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
