import { useCallback, type Dispatch, type KeyboardEvent, type SetStateAction } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { useMutation, graphql } from 'react-relay'
import { X, Check } from 'lucide-react'
import { capitalise } from '../utils/text'
import { handleEnterKeySubmit } from '../utils/form'
import { taskFormSchema, type TaskFormData } from './task-validation'
import type { CreateTaskMutation } from './__generated__/CreateTaskMutation.graphql'
import { TextInput } from '../primitives/form/TextInput'
import { Field } from '../primitives/form/Field'
import { IconPicker } from '../primitives/form/IconPicker'
import { Button } from '../primitives/Button'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler'
import styles from './CreateTask.module.css'

interface CreateTaskProps {
  connectionId: string
  setIsCreating: Dispatch<SetStateAction<boolean>>
}

export const CreateTask = ({ connectionId, setIsCreating }: CreateTaskProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TaskFormData>({
    resolver: arktypeResolver(taskFormSchema),
    defaultValues: { title: '', icon: '' },
  })

  const { showPayloadErrors, showError } = useMutationErrorHandler()

  const [createTask, loading] = useMutation<CreateTaskMutation>(graphql`
    mutation CreateTaskMutation(
      $title: String!
      $icon: String
      $connections: [ID!]!
    ) @raw_response_type {
      createTask(icon: $icon, title: $title) {
        taskEdge @prependEdge(connections: $connections) {
          node {
            ...Task_task
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
    const optimisticTaskId = `client:Task:${crypto.randomUUID()}`
    createTask({
      variables: {
        title: data.title,
        icon: data.icon,
        connections: [connectionId],
      },
      optimisticResponse: {
        createTask: {
          taskEdge: {
            cursor: '',
            node: {
              id: optimisticTaskId,
              title: data.title,
              icon: data.icon || null,
              createdAt: new Date().toISOString(),
              slots: { edges: [] },
            },
          },
        },
      },
      onCompleted: (_response, errors) => {
        showPayloadErrors(errors)
      },
      onError: showError,
    })
    close()
  }

  const submit = handleSubmit(onSubmit)
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    handleEscapeCancel(event)
    handleEnterKeySubmit(submit)(event)
  }

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
            placeholder="New task name"
            error={Boolean(errors.title)}
            autoFocus
            {...register('title')}
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
