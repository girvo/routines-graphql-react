import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { X, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { useMutation, graphql } from 'react-relay'
import { capitalise } from '../utils/text'
import { iconNameSet } from '../utils/icons'
import type { CreateTaskMutation } from './__generated__/CreateTaskMutation.graphql'

const lucideIconName = type('string >= 1').narrow(
  (s, ctx) => iconNameSet.has(s) || ctx.mustBe('a valid Lucide icon name'),
)

const createTaskSchema = type({
  title: 'string >= 1',
  'icon?': lucideIconName,
})

type CreateTaskFormData = typeof createTaskSchema.infer

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
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: arktypeResolver(createTaskSchema),
    defaultValues: {
      title: '',
      icon: '',
    },
  })

  const [createTask] = useMutation<CreateTaskMutation>(graphql`
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
    <tr className="bg-base-200 block rounded-lg md:table-row md:rounded-none md:bg-transparent">
      <td className="block p-4 pb-2 md:table-cell md:p-3 md:align-top">
        <div className="flex flex-col">
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
        </div>
      </td>

      <td className="block px-4 pb-2 md:table-cell md:p-3 md:align-top">
        <div className="flex flex-col">
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
        </div>
      </td>

      <td className="border-base-300 block border-t p-0 md:table-cell md:border-t-0 md:p-3 md:align-top">
        <div className="flex md:gap-1">
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
