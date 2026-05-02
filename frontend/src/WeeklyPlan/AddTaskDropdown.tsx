import { useState, Suspense, useEffect, useRef, useTransition } from 'react'
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  useRefetchableFragment,
} from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import { Plus, Search, Loader2 } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useDebounceValue } from 'usehooks-ts'
import { parseIconName } from '../utils/icons.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import { clsx } from 'clsx'
import { Button } from '../primitives/Button.tsx'
import { AddTaskRow } from './AddTaskRow.tsx'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql.ts'
import type { AddTaskDropdownTasksFragment$key } from './__generated__/AddTaskDropdownTasksFragment.graphql.ts'
import type { DaySelection } from './days.ts'
import type { AddTaskDropdownRoutineSlotMutation } from './__generated__/AddTaskDropdownRoutineSlotMutation.graphql.ts'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../primitives/overlay/popover/Popover.tsx'
import { TextInput } from '../primitives/form/TextInput.tsx'
import styles from './AddTaskDropdown.module.css'

interface TaskListProps {
  fragmentRef: AddTaskDropdownTasksFragment$key
  searchQuery: string
  isLoading: boolean
  onTaskClick: (taskId: string) => void
}

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

  if (data.tasks.edges.length === 0) {
    return <div className={styles.empty}>No tasks found</div>
  }

  return (
    <ul
      className={clsx(styles.list, (isPending || isLoading) && styles.pending)}
    >
      {data.tasks.edges.map(({ node }) => (
        <li key={node.id}>
          <button
            type="button"
            className={styles.option}
            onClick={() => !isLoading && onTaskClick(node.id)}
            disabled={isLoading}
          >
            <DynamicIcon
              name={parseIconName(node.icon)}
              className={styles.optionIcon}
            />
            <span>{node.title}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

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

const AddTaskDropdownContent = ({
  queryRef,
  dayOfWeek,
  daySection,
  connectionId,
  onDone,
}: AddTaskDropdownContentProps) => {
  const { showPayloadErrors, showError } = useMutationErrorHandler()
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

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
      variables: { taskId, dayOfWeek, daySection, connectionId },
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
        onChange={e => setSearchQuery(e.target.value)}
      />
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
  variant?: 'button' | 'row'
}

const renderTrigger = (
  variant: 'button' | 'row',
  onButtonHover: () => void,
) => {
  if (variant === 'row') {
    return <AddTaskRow onMouseEnter={onButtonHover} />
  }
  return (
    <Button
      variant="secondary"
      size="sm"
      leadingIcon={Plus}
      onMouseEnter={onButtonHover}
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

  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom-end">
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
