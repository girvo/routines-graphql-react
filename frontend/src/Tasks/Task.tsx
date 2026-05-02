import { useState, useMemo } from 'react'
import { graphql } from 'relay-runtime'
import { useFragment, useMutation } from 'react-relay'
import { DynamicIcon } from 'lucide-react/dynamic'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { TaskDisplay$key } from './__generated__/TaskDisplay.graphql'
import type { TaskDeleteMutation } from './__generated__/TaskDeleteMutation.graphql.ts'
import { EditTask } from './EditTask.tsx'
import type { EditTaskUpdatable$key } from './__generated__/EditTaskUpdatable.graphql.ts'
import { sectionCounts, sectionLabel } from './section-counts.ts'
import { ConfirmDialog } from '../primitives/modal/ConfirmDialog.tsx'
import { IconChip } from '../primitives/IconChip.tsx'
import { Button } from '../primitives/Button.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover/Popover.tsx'
import { parseIconName } from '../utils/icons.ts'
import styles from './Task.module.css'

interface TaskProps {
  task: TaskDisplay$key
  updatable: EditTaskUpdatable$key
  connectionId: string
}

const iconFromName = (icon: string | null | undefined) => {
  const name = parseIconName(icon)
  const Component = ({ className }: { className?: string }) => (
    <DynamicIcon name={name} className={className} />
  )
  return Component
}

export const Task = ({ task: taskData, updatable, connectionId }: TaskProps) => {
  const task = useFragment(
    graphql`
      fragment TaskDisplay on Task {
        id
        title
        icon
        createdAt
        slots(first: 100) {
          edges {
            node {
              id
              section
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
    taskData,
  )

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [deleteTask] = useMutation<TaskDeleteMutation>(graphql`
    mutation TaskDeleteMutation($taskId: ID!, $connections: [ID!]!) {
      deleteTask(taskId: $taskId) {
        deletedId @deleteEdge(connections: $connections)
      }
    }
  `)

  const handleConfirmDelete = () => {
    deleteTask({ variables: { taskId: task.id, connections: [connectionId] } })
    setShowDeleteConfirm(false)
  }

  const slotCount = task.slots.edges.length
  const hasMore = task.slots.pageInfo.hasNextPage

  const sections = useMemo(
    () => sectionCounts(task.slots.edges.map(({ node }) => node.section)),
    [task.slots.edges],
  )

  if (isEditing) {
    return (
      <EditTask
        taskId={task.id}
        title={task.title}
        icon={task.icon ?? null}
        task={updatable}
        setIsEditing={setIsEditing}
      />
    )
  }

  const IconGlyph = iconFromName(task.icon)
  const onEdit = () => setIsEditing(true)
  const onDelete = () => setShowDeleteConfirm(true)

  return (
    <>
      <div className={styles.root}>
        <span className={styles.iconChip}>
          <IconChip icon={IconGlyph} size="md" />
        </span>
        <span className={styles.title}>{task.title}</span>
        <div className={styles.used}>
          {sections.length === 0 ? (
            <span className={styles.unassigned}>Not yet assigned</span>
          ) : (
            sections.map(({ section, count }) => (
              <SectionChip key={section} label={sectionLabel(section)} count={count} />
            ))
          )}
        </div>
        <span className={styles.slotsCount}>
          {slotCount}
          {hasMore ? '+' : ''}
        </span>
        <div className={styles.actions}>
          <div className={styles.actionsDesktop}>
            <Button
              iconOnly={Pencil}
              variant="ghost"
              size="sm"
              onClick={onEdit}
              aria-label="Edit task"
            />
            <Button
              iconOnly={Trash2}
              variant="ghost"
              size="sm"
              onClick={onDelete}
              aria-label="Delete task"
              className={styles.dangerHover}
            />
          </div>
          <div className={styles.actionsMobile}>
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button
                  iconOnly={MoreHorizontal}
                  variant="ghost"
                  size="sm"
                  aria-label="Task actions"
                />
              </PopoverTrigger>
              <PopoverContent>
                <TaskMenu onEdit={onEdit} onDelete={onDelete} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        confirmLabel="Delete"
        destructive
      >
        Are you sure you want to delete "{task.title}"? This action cannot be undone.
      </ConfirmDialog>
    </>
  )
}

const TaskMenu = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
  <div className={styles.menu}>
    <Button
      leadingIcon={Pencil}
      variant="ghost"
      size="sm"
      align="start"
      fullWidth
      onClick={onEdit}
    >
      Edit
    </Button>
    <Button
      leadingIcon={Trash2}
      variant="ghost"
      size="sm"
      align="start"
      fullWidth
      onClick={onDelete}
      className={styles.dangerHover}
    >
      Delete
    </Button>
  </div>
)

const SectionChip = ({ label, count }: { label: string; count: number }) => (
  <span className={styles.sectionChip}>
    <span className={styles.sectionName}>{label}</span>
    <span className={styles.sectionCount}>×{count}</span>
  </span>
)
