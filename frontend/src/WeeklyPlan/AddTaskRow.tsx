import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Plus } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './AddTaskRow.module.css'

interface AddTaskRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export const AddTaskRow = forwardRef<HTMLButtonElement, AddTaskRowProps>(
  ({ label = 'Add task', className, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} className={clsx(styles.root, className)} {...rest}>
      <span className={styles.plusBox} aria-hidden>
        <Plus className={styles.icon} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  ),
)
AddTaskRow.displayName = 'AddTaskRow'
