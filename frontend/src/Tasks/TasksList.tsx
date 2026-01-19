import { graphql, usePaginationFragment } from 'react-relay'
import { type Dispatch, type SetStateAction } from 'react'
import { Task } from './Task'
import { CreateTask } from './CreateTask'
import type { TasksList_tasks$key } from './__generated__/TasksList_tasks.graphql'

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
              ...TaskDisplay
              ...EditTaskUpdatable
            }
          }
        }
      }
    `,
    tasksRef,
  )

  return (
    <>
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
              updatable={node}
              connectionId={data.tasks.__id}
            />
          )
        })}
      </tbody>
      {hasNext && (
        <tfoot>
          <tr>
            <td colSpan={4} className="p-4 text-center">
              <button
                className="btn btn-primary"
                onClick={() => loadNext(20)}
                disabled={isLoadingNext}
              >
                {isLoadingNext ? 'Loading...' : 'Load More'}
              </button>
            </td>
          </tr>
        </tfoot>
      )}
    </>
  )
}
