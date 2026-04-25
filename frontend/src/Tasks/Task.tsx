import { useState, useMemo } from 'react'
import { graphql } from 'relay-runtime'
import { useFragment, useMutation } from 'react-relay'
import type { TaskDisplay$key } from './__generated__/TaskDisplay.graphql'
import type { TaskDeleteMutation } from './__generated__/TaskDeleteMutation.graphql.ts'
import { EditTask } from './EditTask.tsx'
import type { EditTaskUpdatable$key } from './__generated__/EditTaskUpdatable.graphql.ts'
import { TaskCard } from './TaskCard.tsx'
import { sectionCounts } from './section-counts.ts'
import { ConfirmDialog } from '../primitives/modal/ConfirmDialog.tsx'

interface TaskProps {
  task: TaskDisplay$key
  updatable: EditTaskUpdatable$key
  connectionId: string
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

  return (
    <>
      <TaskCard
        title={task.title}
        icon={task.icon}
        sections={sections}
        totalSlots={slotCount}
        hasMoreSlots={hasMore}
        onEdit={() => setIsEditing(true)}
        onDelete={() => setShowDeleteConfirm(true)}
      />
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
