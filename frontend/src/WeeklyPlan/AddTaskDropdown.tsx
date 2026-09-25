import {
  useState,
  Suspense,
  useEffect,
  useRef,
  useTransition,
  useCallback,
  type ChangeEvent,
  type Ref,
} from 'react'
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  useRefetchableFragment,
} from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import { Plus, Search, Loader2 } from 'lucide-react'
import { useDebounceCallback } from 'usehooks-ts'
import { iconComponent } from '../utils/icons.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import { clsx } from 'clsx'
import { Button } from '../primitives/Button.tsx'
import { AddTaskRow } from './AddTaskRow.tsx'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type {
  AddTaskDropdown_query$data,
  AddTaskDropdown_query$key,
} from './__generated__/AddTaskDropdown_query.graphql.ts'
import type { AddTaskDropdownTasksRefetchQuery } from './__generated__/AddTaskDropdownTasksRefetchQuery.graphql.ts'
import type { DaySelection } from './days.ts'
import type { AddTaskDropdownRoutineSlotMutation } from './__generated__/AddTaskDropdownRoutineSlotMutation.graphql.ts'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../primitives/overlay/popover/Popover.tsx'
import { TextInput } from '../primitives/form/TextInput.tsx'
import styles from './AddTaskDropdown.module.css'

interface ClickedTask {
  id: string
  title: string
  icon: string | null | undefined
}

interface TaskListProps {
  edges: AddTaskDropdown_query$data['tasks']['edges']
  isPending: boolean
  isLoading: boolean
  onTaskClick: (task: ClickedTask) => void
  selectedIndex: number
  listRef: Ref<HTMLDivElement>
}

const TaskList = ({
  edges,
  isPending,
  isLoading,
  onTaskClick,
  selectedIndex,
  listRef,
}: TaskListProps) => (
  <div
    ref={listRef}
    id="addtask-listbox"
    role="listbox"
    aria-label="Tasks"
    className={clsx(styles.list, (isPending || isLoading) && styles.pending)}
  >
    {edges.length === 0 && <div className={styles.empty}>No tasks found</div>}
    {edges.length > 0 &&
      edges.map(({ node }, i) => {
        const Icon = iconComponent(node.icon)
        return (
          <button
            key={node.id}
            type="button"
            id={`addtask-opt-${i}`}
            role="option"
            aria-selected={i === selectedIndex}
            className={clsx(
              styles.option,
              i === selectedIndex && styles.active,
            )}
            onClick={() => !isLoading && onTaskClick(node)}
            disabled={isLoading}
          >
            <Icon className={styles.optionIcon} />
            <span>{node.title}</span>
          </button>
        )
      })}
  </div>
)

const TaskListFallback = () => (
  <div className={styles.fallback}>
    <Loader2 className={styles.spinner} aria-hidden />
  </div>
)

interface AddTaskDropdownContentProps extends DaySelection {
  queryRef: PreloadedQuery<AddTaskDropdownQuery>
  connectionId: string
  onDone: () => void
}

/** @internal exporting for interaction tests */
export const AddTaskDropdownContent = ({
  queryRef,
  dayOfWeek,
  daySection,
  connectionId,
  onDone,
}: AddTaskDropdownContentProps) => {
  const { showPayloadErrors, showError } = useMutationErrorHandler()
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const queryData = usePreloadedQuery(
    graphql`
      query AddTaskDropdownQuery {
        ...AddTaskDropdown_query
      }
    `,
    queryRef,
  )

  const [data, refetch] = useRefetchableFragment<
    AddTaskDropdownTasksRefetchQuery,
    AddTaskDropdown_query$key
  >(
    graphql`
      fragment AddTaskDropdown_query on Query
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
    queryData,
  )
  const edges = data.tasks.edges

  const [isPending, startTransition] = useTransition()
  const refetchByTitle = useCallback(
    (titleSearch: string | null) => {
      startTransition(() => {
        refetch({ titleSearch }, { fetchPolicy: 'store-and-network' })
      })
    },
    [refetch],
  )
  const debouncedRefetchByTitle = useDebounceCallback(refetchByTitle, 300)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setSearchQuery(next)
    setSelectedIndex(-1)
    debouncedRefetchByTitle(next || null)
  }

  useEffect(() => {
    if (selectedIndex >= 0) {
      const selected = listRef.current?.querySelector('[aria-selected="true"]')
      selected?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const count = edges.length
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => {
        if (count === 0) return -1
        if (prev < 0) return 0
        return (prev + 1) % count
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => {
        if (count === 0) return -1
        if (prev < 0) return count - 1
        return (prev - 1 + count) % count
      })
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const selected = listRef.current?.querySelector<HTMLElement>(
        `#addtask-opt-${selectedIndex}`,
      )
      selected?.click()
    }
  }

  const [createRoutineSlot, isLoading] =
    useMutation<AddTaskDropdownRoutineSlotMutation>(graphql`
      mutation AddTaskDropdownRoutineSlotMutation(
        $taskId: ID!
        $dayOfWeek: DayOfWeek!
        $daySection: DaySection!
        $connections: [ID!]!
      ) @raw_response_type {
        createRoutineSlot(
          input: {
            taskId: $taskId
            dayOfWeek: $dayOfWeek
            section: $daySection
          }
        ) {
          routineSlotEdge @appendEdge(connections: $connections) {
            node {
              section
              task {
                title
              }
              ...RoutineSlotItem_routineSlot
            }
          }
        }
      }
    `)

  const handleTaskClick = (task: ClickedTask) => {
    if (isLoading) return
    const optimisticSlotId = `client:RoutineSlot:${crypto.randomUUID()}`
    const taskSlotsConnectionId = ConnectionHandler.getConnectionID(
      task.id,
      'Task_slots',
    )
    createRoutineSlot({
      variables: {
        taskId: task.id,
        dayOfWeek,
        daySection,
        connections: [connectionId, taskSlotsConnectionId],
      },
      optimisticResponse: {
        createRoutineSlot: {
          routineSlotEdge: {
            node: {
              id: optimisticSlotId,
              section: daySection,
              task: {
                id: task.id,
                title: task.title,
                icon: task.icon ?? null,
              },
            },
          },
        },
      },
      onCompleted: (_response, errors) => {
        showPayloadErrors(errors)
      },
      onError: showError,
    })
    setSearchQuery('')
    onDone()
  }

  return (
    <>
      <TextInput
        ref={searchRef}
        variant="filled"
        size="sm"
        leadingIcon={Search}
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-controls="addtask-listbox"
        aria-expanded
        aria-autocomplete="list"
        aria-activedescendant={
          selectedIndex >= 0 ? `addtask-opt-${selectedIndex}` : undefined
        }
      />
      <TaskList
        listRef={listRef}
        edges={edges}
        isPending={isPending}
        isLoading={isLoading}
        onTaskClick={handleTaskClick}
        selectedIndex={selectedIndex}
      />
    </>
  )
}

interface AddTaskDropdownProps extends DaySelection {
  queryRef: PreloadedQuery<AddTaskDropdownQuery> | null | undefined
  connectionId: string
  onButtonHover: () => void
  variant?: 'button' | 'row'
}

const renderTrigger = (
  variant: 'button' | 'row',
  onButtonHover: () => void,
) => {
  if (variant === 'row') {
    return (
      <AddTaskRow onMouseEnter={onButtonHover} onTouchStart={onButtonHover} />
    )
  }
  return (
    <Button
      variant="secondary"
      size="sm"
      leadingIcon={Plus}
      onMouseEnter={onButtonHover}
      onTouchStart={onButtonHover}
    >
      Add task
    </Button>
  )
}

export const AddTaskDropdown = ({
  queryRef,
  dayOfWeek,
  daySection,
  onButtonHover,
  connectionId,
  variant = 'button',
}: AddTaskDropdownProps) => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (next: boolean) => {
    if (next) onButtonHover()
    setOpen(next)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} placement="bottom-end">
      <PopoverTrigger>{renderTrigger(variant, onButtonHover)}</PopoverTrigger>
      <PopoverContent className={styles.content}>
        <Suspense fallback={<TaskListFallback />}>
          {queryRef && (
            <AddTaskDropdownContent
              queryRef={queryRef}
              connectionId={connectionId}
              dayOfWeek={dayOfWeek}
              daySection={daySection}
              onDone={() => setOpen(false)}
            />
          )}
        </Suspense>
      </PopoverContent>
    </Popover>
  )
}
