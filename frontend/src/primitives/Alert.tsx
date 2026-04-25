import type { ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './Alert.module.css'

export type AlertType = 'error' | 'success' | 'warning' | 'info'

type AlertProps = {
  type: AlertType
  title?: ReactNode
  children: ReactNode
  className?: string
}

const iconFor = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
} as const

export const Alert = ({ type, title, children, className }: AlertProps) => {
  const Icon = iconFor[type]
  return (
    <div role="alert" className={clsx(styles.alert, styles[type], className)}>
      <Icon className={styles.icon} aria-hidden />
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children}
      </div>
    </div>
  )
}
