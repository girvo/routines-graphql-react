import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { X, Check } from 'lucide-react'
import { useMutation, graphql } from 'react-relay'
import { capitalise } from '../utils/text'
import { handleEnterKeySubmit } from '../utils/form'
import { taskFormSchema, type TaskFormData } from './task-validation'
import { TextInput } from '../primitives/form/TextInput'
import { Field } from '../primitives/form/Field'
import { IconPicker } from '../primitives/form/IconPicker'
import { Button } from '../primitives/Button'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import type { EditTaskMutation } from './__generated__/EditTaskMutation.graphql'
import type { EditTask_task$key } from './__generated__/EditTask_task.graphql'
import styles from './CreateTask.module.css'

interface EditTaskProps {
  taskId: string
  title: string
  icon: string | null
  task: EditTask_task$key
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: arktypeResolver(taskFormSchema),
    defaultValues: { title, icon: icon ?? '' },
  })

  const { showPayloadErrors, showError } = useMutationErrorHandler()

  const [updateTask, loading] = useMutation<EditTaskMutation>(graphql`
    mutation EditTaskMutation($input: UpdateTaskInput!) {
      updateTask(input: $input) {
        task {
          ...Task_task
        }
      }
    }
  `)

  const close = useCallback(() => {
    setIsEditing(false)
  }, [setIsEditing])

  const onSubmit = (formData: TaskFormData) => {
    updateTask({
      variables: {
        input: { taskId, title: formData.title, icon: formData.icon },
      },
      optimisticUpdater: store => {
        const { updatableData } =
          store.readUpdatableFragment<EditTask_task$key>(
            graphql`
              fragment EditTask_task on Task @updatable {
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
      onCompleted: (_response, errors) => {
        if (showPayloadErrors(errors)) return
        close()
      },
      onError: showError,
    })
    close()
  }

  const submit = handleSubmit(onSubmit)

  return (
    <div className={styles.row}>
      <div className={styles.iconSlot}>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <IconPicker
              value={field.value ?? null}
              onChange={field.onChange}
              aria-label="Pick task icon"
            />
          )}
        />
      </div>
      <div className={styles.titleField}>
        <Field
          label="Task name"
          hideLabel
          error={errors.title?.message && capitalise(errors.title.message)}
        >
          <TextInput
            placeholder="Task name"
            error={Boolean(errors.title)}
            {...register('title')}
            onKeyDown={handleEnterKeySubmit(submit)}
          />
        </Field>
      </div>
      <span className={styles.slotsCell}>—</span>
      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={X}
          onClick={close}
          disabled={loading}
          className={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          leadingIcon={Check}
          onClick={submit}
          loading={loading}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
