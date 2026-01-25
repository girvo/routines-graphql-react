import { PlusIcon } from 'lucide-react'

interface AddTaskButtonProps {
  onMouseEnter: () => void
}

export const AddTaskButton = ({ onMouseEnter }: AddTaskButtonProps) => (
  <div tabIndex={0} role="button" className="btn pr-2.5 pl-1.5" onMouseEnter={onMouseEnter}>
    <PlusIcon />
    Add task
  </div>
)
