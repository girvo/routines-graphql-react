/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useState } from 'react'

const ACCESS_TOKEN_KEY = 'accessToken'

interface AuthContext {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

export const AuthContext = createContext<AuthContext>({
  accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: () => {},
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null)

  const setAccessToken = useCallback(
    (token: string | null) => {
      if (token) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
      }
      setAccessTokenState(token)
    },
    [setAccessTokenState],
  )

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}
