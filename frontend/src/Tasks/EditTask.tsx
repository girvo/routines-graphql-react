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
import type { EditTaskUpdatable$key } from './__generated__/EditTaskUpdatable.graphql'

interface EditTaskProps {
  taskId: string
  title: string
  icon: string | null
  task: EditTaskUpdatable$key
  setIsEditing: Dispatch<SetStateAction<boolean>>
}

export const EditTask = ({
  taskId,
  title,
  icon,
  task,
  setIsEditing,
}: EditTaskProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: arktypeResolver(taskFormSchema),
    defaultValues: {
      title: title,
      icon: icon ?? '',
    },
  })

  const [updateTask, loading] = useMutation<EditTaskMutation>(graphql`
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

  const onSubmit = (formData: TaskFormData) => {
    console.log({ taskId, ...formData })
    updateTask({
      variables: {
        input: {
          taskId,
          title: formData.title,
          icon: formData.icon,
        },
      },
      optimisticUpdater: store => {
        const { updatableData } =
          store.readUpdatableFragment<EditTaskUpdatable$key>(
            graphql`
              fragment EditTaskUpdatable on Task @updatable {
                id
                title
                icon
              }
            `,
            task,
          )
        updatableData.title = formData.title
        updatableData.icon = formData.icon
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
          disabled={loading}
        />
      </TaskFormCell>
    </TaskFormRow>
  )
}
