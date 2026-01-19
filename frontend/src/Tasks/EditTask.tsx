import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { capitalise } from '../utils/text'
import { taskFormSchema, type TaskFormData } from './task-validation'
import { TaskFormRow } from './TaskForm/TaskFormRow'
import { TaskFormCell } from './TaskForm/TaskFormCell'
import { TaskFormActionButtons } from './TaskForm/TaskFormActionButtons'
import { useMutation, graphql } from 'react-relay'
import type { EditTaskMutation } from './__generated__/EditTaskMutation.graphql'

interface EditTaskProps {
  taskId: string
  title: string
  icon: string | null | undefined
  setIsEditing: Dispatch<SetStateAction<boolean>>
}

export const EditTask = ({
  taskId,
  title,
  icon,
  setIsEditing,
}: EditTaskProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: arktypeResolver(taskFormSchema),
    defaultValues: {
      title,
      icon: icon ?? '',
    },
  })

  const [updateTask] = useMutation<EditTaskMutation>(graphql`
    mutation EditTaskMutation($input: UpdateTaskInput!) {
      updateTask(input: $input) {
        task {
          ...TaskDisplay
        }
      }
    }
  `)

  const close = useCallback(() => {
    setIsEditing(false)
  }, [setIsEditing])

  const onSubmit = (data: TaskFormData) => {
    console.log({ taskId, ...data })
    updateTask({
      variables: {
        input: {
          taskId,
          title: data.title,
          icon: data.icon,
        },
      },
      optimisticUpdater: (store) => {
        const task = store.get(taskId)
        if (task) {
          task.setValue(data.title, 'title')
          task.setValue(data.icon, 'icon')
        }
      },
      onCompleted: () => close(),
    })
    close()
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
          disabled={isSubmitting}
        />
      </TaskFormCell>
    </TaskFormRow>
  )
}
