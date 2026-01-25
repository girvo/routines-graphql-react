import { createContext, use } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'error' | 'success' | 'warning' | 'info'
}

export interface ToastContextValue {
  toasts: Toast[]
  showError: (message: string) => void
  showSuccess: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const context = use(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
