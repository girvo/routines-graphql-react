import { authStore } from './auth-store.ts'

const REFRESH_LOCK = 'auth-refresh'

const requestAccessToken = async (): Promise<string> => {
  const response = await fetch('/api/refresh', { credentials: 'include' })
  if (!response.ok) {
    throw new Error('Refresh failed')
  }
  const data: { accessToken: string } = await response.json()
  return data.accessToken
}

const requestAccessTokenExclusively = async (): Promise<string> =>
  await navigator.locks.request(REFRESH_LOCK, requestAccessToken)

let refreshInFlight: Promise<string> | null = null

export const refreshAccessToken = (): Promise<string> => {
  if (refreshInFlight) return refreshInFlight
  const refresh = requestAccessTokenExclusively().finally(() => {
    refreshInFlight = null
  })
  refreshInFlight = refresh
  return refresh
}

let sessionRestore: Promise<void> | null = null

export const restoreSession = (): Promise<void> => {
  sessionRestore ??= refreshAccessToken().then(
    token => authStore.setAccessToken(token),
    () => authStore.setAccessToken(null),
  )
  return sessionRestore
}
