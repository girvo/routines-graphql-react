const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred'

interface GraphQLError {
  message: string
  extensions?: {
    code?: string
    originalError?: {
      message?: string
    }
  }
}

interface RelayNetworkError {
  name: string
  source?: {
    errors?: GraphQLError[]
  }
}

function isRelayNetworkError(error: unknown): error is RelayNetworkError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'RelayNetwork'
  )
}

export function getErrorMessage(error: unknown): string {
  if (isRelayNetworkError(error)) {
    const firstError = error.source?.errors?.[0]
    if (firstError?.message) {
      return firstError.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return DEFAULT_ERROR_MESSAGE
}