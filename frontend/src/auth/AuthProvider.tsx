import React, { useEffect, useSyncExternalStore } from 'react'
import { authStore, AuthContext } from './auth-store'
import { restoreSession } from './session.ts'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const status = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getSnapshot,
  )

  useEffect(() => {
    void restoreSession()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        status,
        setAccessToken: authStore.setAccessToken,
        clearAccessToken: () => authStore.setAccessToken(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
