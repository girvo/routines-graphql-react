import { useCallback } from 'react'
import { useRevalidator } from 'react-router-dom'
import { useOnVisible } from './use-on-visible.ts'

export const useRefreshOnReturn = () => {
  const revalidator = useRevalidator()
  const revalidate = useCallback(
    () => void revalidator.revalidate(),
    [revalidator],
  )
  useOnVisible(revalidate)
}
