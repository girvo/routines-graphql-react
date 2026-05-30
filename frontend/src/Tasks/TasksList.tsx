import { graphql, usePaginationFragment } from 'react-relay'
import { startTransition, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { Task } from './Task.tsx'
import { CreateTask } from './CreateTask.tsx'
import { Button } from '../primitives/Button.tsx'
import { Card } from '../primitives/layout/Card.tsx'
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
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(
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
              title
              ...Task_task
              ...EditTask_task
            }
          }
        }
      }
    `,
    tasksRef,
  )

  const loadedCount = data.tasks.edges.length
  const subtitle = hasNext ? `${loadedCount}+ total` : `${loadedCount} total`
  usePageHeader({ subtitle })

  const debouncedRefetch = useDebounceCallback(
    (titleSearch: string | null) => {
      startTransition(() => {
        refetch({ titleSearch })
      })
    },
    300,
  )

  useEffect(() => {
    debouncedRefetch(searchQuery.trim() ? searchQuery : null)
    return () => {
      debouncedRefetch.cancel()
    }
  }, [searchQuery, debouncedRefetch])

  const showEmpty = data.tasks.edges.length === 0 && !isCreating

  return (
    <Card responsive>
      <TasksTableHeader />
      {isCreating && (
        <CreateTask setIsCreating={setIsCreating} connectionId={data.tasks.__id} />
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
            onClick={() => loadNext(20)}
            loading={isLoadingNext}
          >
            Load more
          </Button>
        </div>
      )}
    </Card>
  )
}
