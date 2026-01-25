import { useState, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ToastContext, type Toast } from './ToastContext.ts'
import { X } from 'lucide-react'

const TOAST_DURATION = 5000
const EXIT_ANIMATION_DURATION = 200

interface ToastProviderProps {
  children: ReactNode
}

const alertTypeClass: Record<Toast['type'], string> = {
  error: 'alert-error',
  success: 'alert-success',
  warning: 'alert-warning',
  info: 'alert-info',
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
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
    (message: string, type: Toast['type']) => {
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
          <div
            className="toast toast-start toast-bottom z-50"
            role="alert"
            aria-live="assertive"
          >
            {toasts.map(({ id, message, type }) => (
              <div
                key={id}
                className={`alert ${alertTypeClass[type]} shadow-lg animate-[slideInFromBottom_200ms_ease-out_forwards] transition-opacity duration-200 ${
                  exitingIds.has(id) ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span>{message}</span>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => dismiss(id)}
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>,
          toastRoot,
        )}
    </ToastContext>
  )
}
