import type { ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from './Button.tsx'
import styles from './Toast.module.css'

export type ToastType = 'error' | 'success' | 'warning' | 'info'

type ToastProps = {
  type: ToastType
  children: ReactNode
  onDismiss?: () => void
  exiting?: boolean
  className?: string
}

const iconFor = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
} as const

export const Toast = ({ type, children, onDismiss, exiting, className }: ToastProps) => {
  const Icon = iconFor[type]
  return (
    <div
      role="alert"
      className={clsx(styles.toast, styles[type], exiting && styles.exiting, className)}
    >
      <Icon className={styles.icon} aria-hidden />
      <div className={styles.message}>{children}</div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly={X}
          aria-label="Dismiss"
          onClick={onDismiss}
          className={styles.dismiss}
        />
      )}
    </div>
  )
}
