import { useId, type ReactElement, type ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'
import { clsx } from 'clsx'
import styles from './Field.module.css'

type FieldChildProps = {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

type FieldProps = {
  label: ReactNode
  hideLabel?: boolean
  hint?: ReactNode
  error?: ReactNode
  className?: string
  children: ReactElement<FieldChildProps>
}

export const Field = ({
  label,
  hideLabel = false,
  hint,
  error,
  className,
  children,
}: FieldProps) => {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()

  if (!isValidElement<FieldChildProps>(children)) {
    throw new Error('<Field> requires a single React element child')
  }

  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined

  const control = cloneElement(children, {
    id: children.props.id ?? inputId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : children.props['aria-invalid'],
  })

  return (
    <div className={clsx(styles.field, className)}>
      <label
        htmlFor={children.props.id ?? inputId}
        className={clsx(styles.label, hideLabel && styles.labelSrOnly)}
      >
        {label}
      </label>
      {control}
      {hint && !error && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  )
}
