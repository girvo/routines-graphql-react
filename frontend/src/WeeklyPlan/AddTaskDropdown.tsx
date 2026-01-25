import { useState, Suspense, useEffect, useRef } from 'react'
import { graphql, usePreloadedQuery } from 'react-relay'
import type { PreloadedQuery, LoadQueryOptions } from 'react-relay'
import { Search, Loader2 } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useDebounceValue } from 'usehooks-ts'
import { parseIconName } from '../utils/icons.ts'
import { AddTaskButton } from './AddTaskButton.tsx'
import type {
  AddTaskDropdownQuery,
  AddTaskDropdownQuery$variables,
} from './__generated__/AddTaskDropdownQuery.graphql.ts'

interface AddTaskDropdownProps {
  queryRef: PreloadedQuery<AddTaskDropdownQuery> | null | undefined
  loadQuery: (
    variables: AddTaskDropdownQuery$variables,
    options?: LoadQueryOptions,
  ) => void
  onButtonHover: () => void
  onTaskSelect: (taskId: string) => void
}

interface TaskListProps {
  queryRef: PreloadedQuery<AddTaskDropdownQuery>
  onTaskClick: (taskId: string) => void
}

const TaskList = ({ queryRef, onTaskClick }: TaskListProps) => {
  const data = usePreloadedQuery<AddTaskDropdownQuery>(
    graphql`
      query AddTaskDropdownQuery($titleSearch: String) {
        tasks(first: 100, titleSearch: $titleSearch) {
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
    queryRef,
  )

  return (
    <ul className="menu menu-sm mt-2 max-h-60 w-full flex-nowrap gap-2 overflow-y-auto p-0">
      {data.tasks.edges.length === 0 ? (
        <li className="text-base-content/50 p-3 text-center text-sm">
          No tasks found
        </li>
      ) : (
        data.tasks.edges.map(({ node }) => (
          <li key={node.id}>
            <button
              className="flex w-full items-center gap-2"
              onClick={() => onTaskClick(node.id)}
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

export const AddTaskDropdown = ({
  queryRef,
  loadQuery,
  onButtonHover,
  onTaskSelect,
}: AddTaskDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounceValue(searchQuery, 300)

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    loadQuery({ titleSearch: debouncedSearch || null })
  }, [debouncedSearch, loadQuery])

  const handleTaskClick = (taskId: string) => {
    onTaskSelect(taskId)
    setSearchQuery('')
    const activeElement = document.activeElement as HTMLElement | null
    activeElement?.blur()
  }

  const handleDropdownBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setSearchQuery('')
    }
  }

  return (
    <div className="dropdown dropdown-end" onBlur={handleDropdownBlur}>
      <AddTaskButton onMouseEnter={onButtonHover} />
      <div
        tabIndex={0}
        className="dropdown-content bg-base-100 rounded-box z-10 mt-2 w-64 p-2 shadow-lg"
      >
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
        <Suspense fallback={<TaskListFallback />}>
          {queryRef && <TaskList queryRef={queryRef} onTaskClick={handleTaskClick} />}
        </Suspense>
      </div>
    </div>
  )
}
