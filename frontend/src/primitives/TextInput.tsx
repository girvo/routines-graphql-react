import { forwardRef, type ComponentType, type InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './TextInput.module.css'

type IconComponent = ComponentType<{ className?: string }>

type TextInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'

type TextInputProps = {
  variant?: 'bordered' | 'filled' | 'ghost'
  size?: 'sm' | 'md'
  type?: TextInputType
  leadingIcon?: IconComponent
  trailingIcon?: IconComponent
  error?: boolean
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className' | 'type'>

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      variant = 'bordered',
      size = 'md',
      type = 'text',
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      disabled,
      error,
      className,
      ...rest
    },
    ref,
  ) => (
    <span
      className={clsx(
        styles.wrap,
        styles[variant],
        variant !== 'ghost' && styles[size],
        disabled && styles.disabled,
        error && styles.error,
        className,
      )}
      aria-invalid={error || undefined}
    >
      {LeadingIcon && <LeadingIcon className={styles.icon} />}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={styles.input}
        {...rest}
      />
      {TrailingIcon && <TrailingIcon className={styles.icon} />}
    </span>
  ),
)

TextInput.displayName = 'TextInput'
