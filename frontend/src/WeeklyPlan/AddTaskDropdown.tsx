import { useState, Suspense } from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { PlusIcon, Search, Loader2 } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useDebounceValue } from 'usehooks-ts'
import { parseIconName } from '../utils/icons.ts'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'

interface AddTaskDropdownProps {
  onTaskSelect: (taskId: string) => void
}

interface TaskListProps {
  titleSearch: string | null
  onTaskClick: (taskId: string) => void
}

const TaskList = ({ titleSearch, onTaskClick }: TaskListProps) => {
  const data = useLazyLoadQuery<AddTaskDropdownQuery>(
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
    { titleSearch },
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

export const AddTaskDropdown = ({ onTaskSelect }: AddTaskDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounceValue(searchQuery, 300)

  const handleTaskClick = (taskId: string) => {
    onTaskSelect(taskId)
    setSearchQuery('')
    const activeElement = document.activeElement as HTMLElement | null
    activeElement?.blur()
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn pr-2.5 pl-1.5">
        <PlusIcon />
        Add task
      </div>
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
          <TaskList
            titleSearch={debouncedSearch || null}
            onTaskClick={handleTaskClick}
          />
        </Suspense>
      </div>
    </div>
  )
}
