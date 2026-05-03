import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { X, Check } from 'lucide-react'
import { useMutation, graphql } from 'react-relay'
import { DynamicIcon } from 'lucide-react/dynamic'
import { capitalise } from '../utils/text'
import { handleEnterKeySubmit } from '../utils/form'
import { taskFormSchema, type TaskFormData } from './task-validation'
import { TextInput } from '../primitives/form/TextInput'
import { Field } from '../primitives/form/Field'
import { IconBadge } from '../primitives/badge/IconBadge'
import { Button } from '../primitives/Button'
import { parseIconName } from '../utils/icons.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import type { EditTaskMutation } from './__generated__/EditTaskMutation.graphql'
import type { EditTaskUpdatable$key } from './__generated__/EditTaskUpdatable.graphql'
import styles from './CreateTask.module.css'

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
    defaultValues: { title, icon: icon ?? '' },
  })

  const { showPayloadErrors, showError } = useMutationErrorHandler()

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
    updateTask({
      variables: {
        input: { taskId, title: formData.title, icon: formData.icon },
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
      onCompleted: (_response, errors) => {
        if (showPayloadErrors(errors)) return
        close()
      },
      onError: showError,
    })
    close()
  }

  const submit = handleSubmit(onSubmit)
  const iconName = parseIconName(icon)
  const IconGlyph = ({ className }: { className?: string }) => (
    <DynamicIcon name={iconName} className={className} />
  )

  return (
    <div className={styles.row}>
      <div className={styles.iconSlot}>
        <IconBadge icon={IconGlyph} size="md" />
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
      <div className={styles.iconField}>
        <Field
          label="Icon"
          hideLabel
          error={errors.icon?.message && capitalise(errors.icon.message)}
        >
          <TextInput
            placeholder="Lucide icon name"
            error={Boolean(errors.icon)}
            {...register('icon')}
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
