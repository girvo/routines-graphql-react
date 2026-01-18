import { X, Check } from 'lucide-react'
import { useCallback, type Dispatch, type SetStateAction } from 'react'

interface CreateTaskProps {
  setIsCreating: Dispatch<SetStateAction<boolean>>
}

export const CreateTask = ({ setIsCreating }: CreateTaskProps) => {
  const close = useCallback(() => {
    setIsCreating(false)
  }, [setIsCreating])

  return (
    <tr>
      <td>
        <input />
      </td>
      <td>
        <input />
      </td>
      <td>0 slots</td>
      <td>
        <div className="flex items-center justify-center md:gap-1">
          <button
            className="btn btn-ghost btn-sm text-error flex-1 rounded-none rounded-bl-lg md:flex-none md:rounded"
            onClick={close}
          >
            <X className="size-4" />
            <span className="md:hidden">Cancel</span>
          </button>
          <button
            className="btn btn-ghost btn-sm flex-1 rounded-none rounded-br-lg md:flex-none md:rounded"
            onClick={close}
          >
            <Check className="size-4" />
            <span className="md:hidden">Save</span>
          </button>
        </div>
      </td>
    </tr>
  )
}
