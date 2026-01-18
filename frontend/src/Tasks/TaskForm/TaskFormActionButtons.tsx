import { X, Check } from 'lucide-react'

interface TaskFormActionButtonsProps {
  onCancel: () => void
  onSave: () => void
  disabled?: boolean
}

export const TaskFormActionButtons = ({
  onCancel,
  onSave,
  disabled,
}: TaskFormActionButtonsProps) => {
  return (
    <div className="flex md:justify-center md:gap-1">
      <button
        type="button"
        className="btn btn-ghost btn-sm text-error flex-1 rounded-none rounded-bl-lg md:flex-none md:rounded"
        onClick={onCancel}
        disabled={disabled}
      >
        <X className="size-4" />
        <span className="md:hidden">Cancel</span>
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm flex-1 rounded-none rounded-br-lg md:flex-none md:rounded"
        onClick={onSave}
        disabled={disabled}
      >
        <Check className="size-4" />
        <span className="md:hidden">Save</span>
      </button>
    </div>
  )
}
