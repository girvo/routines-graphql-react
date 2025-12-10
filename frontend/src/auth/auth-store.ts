import { createContext } from 'react'

const ACCESS_TOKEN_KEY = 'accessToken'

interface AuthContext {
  hasAccessToken: boolean
  setAccessToken: (token: string | null) => void
  clearAccessToken: () => void
}

type Listener = () => void

class AuthStore {
  private listeners = new Set<Listener>()
  private accessToken: string | null = null

  constructor() {
    this.accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => {
    return this.accessToken !== null
  }

  setAccessToken = (token: string | null) => {
    const hadToken = this.accessToken !== null
    const hasToken = token !== null

    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
    this.accessToken = token

    if (hadToken !== hasToken) {
      this.listeners.forEach(listener => listener())
    }
  }
}

export const authStore = new AuthStore()

export const AuthContext = createContext<AuthContext>({
  hasAccessToken: false,
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
  return authStore['accessToken']
}
