import { forwardRef, type ComponentType, type InputHTMLAttributes } from 'react'
import { cn } from '../utils/tailwind.ts'
import styles from './TextInput.module.css'

type IconComponent = ComponentType<{ className?: string }>

type TextInputProps = {
  variant?: 'bordered' | 'filled' | 'ghost'
  size?: 'sm' | 'md'
  leadingIcon?: IconComponent
  trailingIcon?: IconComponent
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className' | 'type'>

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      variant = 'bordered',
      size = 'md',
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      disabled,
      className,
      ...rest
    },
    ref,
  ) => (
    <span
      className={cn(
        styles.wrap,
        styles[variant],
        variant !== 'ghost' && styles[size],
        disabled && styles.disabled,
        className,
      )}
    >
      {LeadingIcon && <LeadingIcon className={styles.icon} />}
      <input
        ref={ref}
        type="text"
        disabled={disabled}
        className={styles.input}
        {...rest}
      />
      {TrailingIcon && <TrailingIcon className={styles.icon} />}
    </span>
  ),
)

TextInput.displayName = 'TextInput'
