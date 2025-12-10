import React, { useSyncExternalStore } from 'react'
import { authStore, AuthContext } from './auth-store'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const hasAccessToken = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getSnapshot,
  )

  return (
    <AuthContext.Provider
      value={{
        hasAccessToken,
        setAccessToken: authStore.setAccessToken,
        clearAccessToken: () => authStore.setAccessToken(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
