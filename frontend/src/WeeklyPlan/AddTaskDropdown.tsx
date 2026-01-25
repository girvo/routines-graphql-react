import { useState, Suspense, useEffect, useRef, useTransition } from 'react'
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  useRefetchableFragment,
} from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import { Search, Loader2 } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useDebounceValue } from 'usehooks-ts'
import { parseIconName } from '../utils/icons.ts'
import { AddTaskButton } from './AddTaskButton.tsx'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { AddTaskDropdownTasksFragment$key } from './__generated__/AddTaskDropdownTasksFragment.graphql.ts'
import type { DaySelection } from './days.ts'
import type { AddTaskDropdownRoutineSlotMutation } from './__generated__/AddTaskDropdownRoutineSlotMutation.graphql.ts'

interface TaskListProps {
  fragmentRef: AddTaskDropdownTasksFragment$key
  searchQuery: string
  isLoading: boolean
  onTaskClick: (taskId: string) => void
}

// TODO: Refactor the actual display of the task to be a component w/ fragment
const TaskList = ({
  fragmentRef,
  searchQuery,
  isLoading,
  onTaskClick,
}: TaskListProps) => {
  const [data, refetch] = useRefetchableFragment(
    graphql`
      fragment AddTaskDropdownTasksFragment on Query
      @refetchable(queryName: "AddTaskDropdownTasksRefetchQuery")
      @argumentDefinitions(
        titleSearch: { type: "String", defaultValue: null }
      ) {
        tasks(first: 5, titleSearch: $titleSearch) {
          edges {
            node {
              id
              title
              icon
            }
          }
        }
      }
    `,
    fragmentRef,
  )

  const [debouncedSearch] = useDebounceValue(searchQuery, 300)
  const [isPending, startTransition] = useTransition()

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    startTransition(() => {
      refetch({ titleSearch: debouncedSearch || null })
    })
  }, [debouncedSearch, refetch])

  return (
    <ul className="menu menu-sm mt-2 max-h-60 w-full flex-nowrap gap-2 overflow-y-auto p-0">
      {data.tasks.edges.length === 0 ? (
        <li className="text-base-content/50 p-3 text-center text-sm">
          No tasks found
        </li>
      ) : (
        data.tasks.edges.map(({ node }) => (
          <li
            key={node.id}
            className={isPending || isLoading ? 'opacity-50' : ''}
          >
            <button
              className="flex w-full items-center gap-2"
              onClick={() => !isLoading && onTaskClick(node.id)}
            >
              <DynamicIcon name={parseIconName(node.icon)} className="size-4" />
              <span>{node.title}</span>
            </button>
          </li>
        ))
      )}
    </ul>
  )
}

const TaskListFallback = () => (
  <div className="flex h-20 items-center justify-center">
    <Loader2 className="text-base-content/50 size-5 animate-spin" />
  </div>
)

interface AddTaskDropdownContentProps extends DaySelection {
  queryRef: PreloadedQuery<AddTaskDropdownQuery>
  connectionId: string
}

const AddTaskDropdownContent = ({
  queryRef,
  dayOfWeek,
  daySection,
  connectionId,
}: AddTaskDropdownContentProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const data = usePreloadedQuery(
    graphql`
      query AddTaskDropdownQuery {
        ...AddTaskDropdownTasksFragment
      }
    `,
    queryRef,
  )

  const [createRoutineSlot, isLoading] =
    useMutation<AddTaskDropdownRoutineSlotMutation>(graphql`
      mutation AddTaskDropdownRoutineSlotMutation(
        $taskId: ID!
        $dayOfWeek: DayOfWeek!
        $daySection: DaySection!
        $connectionId: ID!
      ) {
        createRoutineSlot(
          input: {
            taskId: $taskId
            dayOfWeek: $dayOfWeek
            section: $daySection
          }
        ) {
          routineSlotEdge @appendEdge(connections: [$connectionId]) {
            cursor
            node {
              id
              task {
                title
                id
                icon
              }
            }
          }
        }
      }
    `)

  const handleTaskClick = (taskId: string) => {
    if (isLoading) return

    createRoutineSlot({
      variables: {
        taskId,
        dayOfWeek,
        daySection,
        connectionId,
      },
      onError: err => {
        console.log('Got an error!', err.source)
        // console.debug(err)
      },
    })

    setSearchQuery('')
    const activeElement = document.activeElement as HTMLElement | null
    activeElement?.blur()
  }

  return (
    <>
      <label className="input input-ghost input-sm pl-1">
        <Search className="h-[1em] opacity-50" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="grow"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          autoFocus
        />
      </label>
      <TaskList
        fragmentRef={data}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onTaskClick={handleTaskClick}
      />
    </>
  )
}

interface AddTaskDropdownProps extends DaySelection {
  queryRef: PreloadedQuery<AddTaskDropdownQuery> | null | undefined
  connectionId: string
  onButtonHover: () => void
}

export const AddTaskDropdown = ({
  queryRef,
  dayOfWeek,
  daySection,
  onButtonHover,
  connectionId,
}: AddTaskDropdownProps) => {
  const handleDropdownBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      // Reset search handled by AddTaskDropdownContent unmounting/remounting
    }
  }

  return (
    <div className="dropdown dropdown-end" onBlur={handleDropdownBlur}>
      <AddTaskButton onMouseEnter={onButtonHover} />
      <div
        tabIndex={0}
        className="dropdown-content bg-base-100 rounded-box z-10 mt-2 w-64 p-2 shadow-lg"
      >
        <Suspense fallback={<TaskListFallback />}>
          {queryRef && (
            <AddTaskDropdownContent
              queryRef={queryRef}
              connectionId={connectionId}
              dayOfWeek={dayOfWeek}
              daySection={daySection}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}
