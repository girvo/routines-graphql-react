import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { capitalise } from '../utils/text'
import { taskFormSchema, type TaskFormData } from './task-validation'
import { TaskFormRow } from './TaskForm/TaskFormRow'
import { TaskFormCell } from './TaskForm/TaskFormCell'
import { TaskFormActionButtons } from './TaskForm/TaskFormActionButtons'

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

  const close = useCallback(() => {
    setIsEditing(false)
  }, [setIsEditing])

  const onSubmit = (data: TaskFormData) => {
    console.log({ taskId, ...data })
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
