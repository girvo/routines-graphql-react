import { useCallback, type Dispatch, type KeyboardEvent, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { useMutation, graphql } from 'react-relay'
import { X, Check } from 'lucide-react'
import { capitalise } from '../utils/text'
import { handleEnterKeySubmit } from '../utils/form'
import { taskFormSchema, type TaskFormData } from './task-validation'
import type { CreateTaskMutation } from './__generated__/CreateTaskMutation.graphql'
import { TextInput } from '../primitives/form/TextInput'
import { Field } from '../primitives/form/Field'
import { IconBadge } from '../primitives/badge/IconBadge'
import { Button } from '../primitives/Button'
import styles from './CreateTask.module.css'

interface CreateTaskProps {
  connectionId: string
  setIsCreating: Dispatch<SetStateAction<boolean>>
}

const EmptyIcon = () => null

export const CreateTask = ({ connectionId, setIsCreating }: CreateTaskProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TaskFormData>({
    resolver: arktypeResolver(taskFormSchema),
    defaultValues: { title: '', icon: '' },
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

  const handleEscapeCancel = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        const { title, icon } = getValues()
        if (!title && !icon) close()
      }
    },
    [getValues, close],
  )

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

  const submit = handleSubmit(onSubmit)
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    handleEscapeCancel(event)
    handleEnterKeySubmit(submit)(event)
  }

  return (
    <div className={styles.row}>
      <div className={styles.iconSlot}>
        <IconBadge icon={EmptyIcon} size="md" />
      </div>
      <div className={styles.titleField}>
        <Field
          label="Task name"
          hideLabel
          error={errors.title?.message && capitalise(errors.title.message)}
        >
          <TextInput
            placeholder="New task name"
            error={Boolean(errors.title)}
            autoFocus
            {...register('title')}
            onKeyDown={onKeyDown}
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
            onKeyDown={onKeyDown}
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
