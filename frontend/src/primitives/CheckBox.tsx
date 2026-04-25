import type { InputHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './CheckBox.module.css'

type CheckBoxBase = {
  checked: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'size'
  | 'onChange'
  | 'checked'
  | 'type'
  | 'className'
  | 'children'
  | 'aria-label'
  | 'aria-labelledby'
>

type CheckBoxProps = CheckBoxBase &
  (
    | { children: ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string }
    | { children?: undefined; 'aria-label': string; 'aria-labelledby'?: string }
    | { children?: undefined; 'aria-label'?: string; 'aria-labelledby': string }
  )

export const CheckBox = ({
  checked,
  onChange,
  size = 'md',
  disabled,
  className,
  children,
  ...rest
}: CheckBoxProps) => (
  <label className={clsx(styles.root, styles[size], disabled && styles.disabled, className)}>
    <input
      type="checkbox"
      className={styles.input}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.checked)}
      {...rest}
    />
    <span className={styles.box} aria-hidden>
      <Check className={styles.check} strokeWidth={3} />
    </span>
    {children && <span className={styles.labelText}>{children}</span>}
  </label>
)
