import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { X, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { useMutation, graphql, useFragment } from 'react-relay'
import { capitalise } from '../utils/text'
import type { CreateTask$key } from './__generated__/CreateTask.graphql'
import { iconNames } from 'lucide-react/dynamic'

const iconNameSet = new Set<string>(iconNames)

const lucideIconName = type('string >= 1').narrow(
  (s, ctx) => iconNameSet.has(s) || ctx.mustBe('a valid Lucide icon name'),
)

const createTaskSchema = type({
  title: 'string >= 1',
  'icon?': lucideIconName,
})

type CreateTaskFormData = typeof createTaskSchema.infer

interface CreateTaskProps {
  tasks: CreateTask$key
  setIsCreating: Dispatch<SetStateAction<boolean>>
}

export const CreateTask = ({ tasks, setIsCreating }: CreateTaskProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: arktypeResolver(createTaskSchema),
    defaultValues: {
      title: '',
      icon: '',
    },
  })

  const taskConnection = useFragment(
    graphql`
      fragment CreateTask on TaskConnection {
        __id
      }
    `,
    tasks,
  )

  const [createTask, loading] = useMutation(graphql`
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

  const onSubmit = (data: CreateTaskFormData) => {
    createTask({
      variables: {
        title: data.title,
        icon: data.icon,
        connections: [taskConnection.__id],
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
    <tr>
      <td className="align-top">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Task name"
            className={`input ${errors.title ? 'input-error' : ''}`}
            {...register('title')}
          />
          {errors.title?.message && (
            <span className="text-error mt-1 text-xs">
              {capitalise(errors.title.message)}
            </span>
          )}
        </div>
      </td>
      <td className="align-top">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Lucide icon name"
            className={`input ${errors.icon ? 'input-error' : ''}`}
            {...register('icon')}
          />
          {errors.icon?.message && (
            <span className="text-error mt-1 text-xs">
              {capitalise(errors.icon.message)}
            </span>
          )}
        </div>
      </td>
      <td className="align-top">
        <div className="flex h-10 items-center">0 slots</div>
      </td>
      <td className="align-top">
        <div className="flex h-10 items-center justify-center md:gap-1">
          <button
            type="button"
            className="btn btn-ghost btn-sm text-error flex-1 rounded-none rounded-bl-lg md:flex-none md:rounded"
            onClick={close}
            disabled={isSubmitting}
          >
            <X className="size-4" />
            <span className="md:hidden">Cancel</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm flex-1 rounded-none rounded-br-lg md:flex-none md:rounded"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Check className="size-4" />
            <span className="md:hidden">Save</span>
          </button>
        </div>
      </td>
    </tr>
  )
}
