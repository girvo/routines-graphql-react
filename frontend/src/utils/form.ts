import type { KeyboardEvent } from 'react'

export const handleEnterKeySubmit =
  (onSubmit: () => void) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
    }
  }
