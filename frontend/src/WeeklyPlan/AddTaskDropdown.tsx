import { useState, useMemo } from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { PlusIcon, Search } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { parseIconName } from '../utils/icons.ts'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'

interface AddTaskDropdownProps {
  onTaskSelect: (taskId: string) => void
}

export const AddTaskDropdown = ({ onTaskSelect }: AddTaskDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const data = useLazyLoadQuery<AddTaskDropdownQuery>(
    graphql`
      query AddTaskDropdownQuery {
        tasks(first: 100) {
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
    {},
  )

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return data.tasks.edges

    return data.tasks.edges.filter(({ node }) =>
      node.title.toLowerCase().includes(query),
    )
  }, [data.tasks.edges, searchQuery])

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
        <div className="relative mb-1">
          <Search className="text-base-content/50 absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="input input-bordered input-sm w-full pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <ul className="menu menu-sm max-h-60 w-full flex-nowrap overflow-y-auto p-0">
          {filteredTasks.length === 0 ? (
            <li className="text-base-content/50 p-3 text-center text-sm">
              No tasks found
            </li>
          ) : (
            filteredTasks.map(({ node }) => (
              <li key={node.id}>
                <button
                  className="flex w-full items-center gap-2"
                  onClick={() => handleTaskClick(node.id)}
                >
                  <DynamicIcon
                    name={parseIconName(node.icon)}
                    className="size-4"
                  />
                  <span>{node.title}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
