/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useSyncExternalStore } from 'react'

const ACCESS_TOKEN_KEY = 'accessToken'

interface AuthContext {
  accessToken: string | null
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
    return this.accessToken
  }

  setAccessToken = (token: string | null) => {
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
    this.accessToken = token
    this.listeners.forEach(listener => listener())
  }

  clearAccessToken = () => {
    this.setAccessToken(null)
  }
}

const authStore = new AuthStore()

export const AuthContext = createContext<AuthContext>({
  accessToken: authStore.getSnapshot(),
  setAccessToken: authStore.setAccessToken,
  clearAccessToken: authStore.clearAccessToken,
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const accessToken = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getSnapshot,
  )

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken: authStore.setAccessToken,
        clearAccessToken: authStore.clearAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * This is for non-React use-cases
 */
export const clearAccessToken = () => {
  authStore.clearAccessToken()
}

export const setAccessToken = (token: string) => {
  authStore.setAccessToken(token) // I wonder how we do this without re-rendering...
}

export const getAccessToken = () => authStore.getSnapshot()
