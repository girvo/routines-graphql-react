import type { PayloadError } from 'relay-runtime'
import { useToast } from '../toast/ToastContext.ts'
import { getErrorMessage } from '../utils/errors.ts'

export const useMutationErrorHandler = () => {
  const { showError } = useToast()
  return {
    showPayloadErrors: (
      errors: readonly PayloadError[] | null | undefined,
    ): boolean => {
      if (!errors?.length) return false
      errors.forEach((error) => showError(getErrorMessage(error)))
      return true
    },
    showError: (error: Error) => showError(getErrorMessage(error)),
  }
}
