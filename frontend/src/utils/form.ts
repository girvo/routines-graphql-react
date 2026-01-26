import type { KeyboardEvent } from 'react'

export const handleEnterKeySubmit =
  (onSubmit: () => void) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
    }
  }

export const handleEscapeBlur = (event: KeyboardEvent<HTMLElement>) => {
  if (event.key === 'Escape') {
    ;(document.activeElement as HTMLElement | null)?.blur()
  }
}
