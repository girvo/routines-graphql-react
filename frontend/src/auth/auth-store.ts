import { createContext } from 'react'

export type AuthStatus = 'restoring' | 'signedIn' | 'signedOut'

interface AuthContext {
  status: AuthStatus
  setAccessToken: (token: string | null) => void
  clearAccessToken: () => void
}

type Listener = () => void

class AuthStore {
  private listeners = new Set<Listener>()
  private accessToken: string | null = null
  private restoring = true

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = (): AuthStatus => {
    if (this.restoring) return 'restoring'
    return this.accessToken === null ? 'signedOut' : 'signedIn'
  }

  get token(): string | null {
    return this.accessToken
  }

  setAccessToken = (token: string | null) => {
    const previousStatus = this.getSnapshot()

    this.restoring = false
    this.accessToken = token

    if (this.getSnapshot() !== previousStatus) {
      this.listeners.forEach(listener => listener())
    }
  }
}

export const authStore = new AuthStore()

export const AuthContext = createContext<AuthContext>({
  status: 'signedOut',
  setAccessToken: authStore.setAccessToken,
  clearAccessToken: () => authStore.setAccessToken(null),
})

export const setAccessToken = (token: string) => {
  authStore.setAccessToken(token)
}

export const clearAccessToken = () => {
  authStore.setAccessToken(null)
}

export const getAccessToken = (): string | null => {
  return authStore.token
}
