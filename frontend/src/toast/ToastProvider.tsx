import { useState, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ToastContext, type Toast as ToastData } from './ToastContext.ts'
import { Toast } from '../primitives/Toast.tsx'
import styles from './ToastProvider.module.css'

const TOAST_DURATION = 5000
const EXIT_ANIMATION_DURATION = 200

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())

  const dismiss = useCallback((id: string) => {
    setExitingIds(prev => new Set(prev).add(id))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      setExitingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, EXIT_ANIMATION_DURATION)
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastData['type']) => {
      const id = crypto.randomUUID()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => dismiss(id), TOAST_DURATION)
    },
    [dismiss],
  )

  const showError = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast],
  )

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast],
  )

  const showWarning = useCallback(
    (message: string) => showToast(message, 'warning'),
    [showToast],
  )

  const showInfo = useCallback(
    (message: string) => showToast(message, 'info'),
    [showToast],
  )

  const toastRoot = document.getElementById('toast-root')

  return (
    <ToastContext
      value={{ toasts, showError, showSuccess, showWarning, showInfo, dismiss }}
    >
      {children}
      {toastRoot &&
        createPortal(
          <div className={styles.stack} aria-live="assertive">
            {toasts.map(({ id, message, type }) => (
              <Toast
                key={id}
                type={type}
                exiting={exitingIds.has(id)}
                onDismiss={() => dismiss(id)}
              >
                {message}
              </Toast>
            ))}
          </div>,
          toastRoot,
        )}
    </ToastContext>
  )
}
