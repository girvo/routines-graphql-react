import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { useMutation, graphql } from 'react-relay'
import { capitalise } from '../utils/text'
import { taskFormSchema, type TaskFormData } from './task-validation'
import type { CreateTaskMutation } from './__generated__/CreateTaskMutation.graphql'
import { TaskFormRow } from './TaskForm/TaskFormRow'
import { TaskFormCell } from './TaskForm/TaskFormCell'
import { TaskFormActionButtons } from './TaskForm/TaskFormActionButtons'

interface CreateTaskProps {
  connectionId: string
  setIsCreating: Dispatch<SetStateAction<boolean>>
}

export const CreateTask = ({
  connectionId,
  setIsCreating,
}: CreateTaskProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: arktypeResolver(taskFormSchema),
    defaultValues: {
      title: '',
      icon: '',
    },
  })

  const [createTask, loading] = useMutation<CreateTaskMutation>(graphql`
    mutation CreateTaskMutation(
      $title: String!
      $icon: String
      $connections: [ID!]!
    ) {
      createTask(icon: $icon, title: $title) {
        taskEdge @prependEdge(connections: $connections) {
          node {
            ...TaskDisplay
          }
          cursor
        }
      }
    }
  `)

  const close = useCallback(() => {
    setIsCreating(false)
  }, [setIsCreating])

  const onSubmit = (data: TaskFormData) => {
    createTask({
      variables: {
        title: data.title,
        icon: data.icon,
        connections: [connectionId],
      },
      onCompleted: (_response, errors) => {
        if ((errors?.length ?? 0) > 0) {
          console.error(errors)
          return
        }
        close()
      },
    })
  }

  return (
    <TaskFormRow>
      <TaskFormCell variant="first">
        <input
          type="text"
          placeholder="Task name"
          className={`input w-full ${errors.title ? 'input-error' : ''}`}
          {...register('title')}
        />
        {errors.title?.message && (
          <span className="text-error mt-1 text-xs">
            {capitalise(errors.title.message)}
          </span>
        )}
      </TaskFormCell>

      <TaskFormCell variant="field">
        <input
          type="text"
          placeholder="Lucide icon name"
          className={`input w-full ${errors.icon ? 'input-error' : ''}`}
          {...register('icon')}
        />
        {errors.icon?.message && (
          <span className="text-error mt-1 text-xs">
            {capitalise(errors.icon.message)}
          </span>
        )}
      </TaskFormCell>

      <TaskFormCell variant="empty" />

      <TaskFormCell variant="actions">
        <TaskFormActionButtons
          onCancel={close}
          onSave={handleSubmit(onSubmit)}
          disabled={loading}
        />
      </TaskFormCell>
    </TaskFormRow>
  )
}
