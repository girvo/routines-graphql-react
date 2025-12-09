/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

interface AuthContext {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

export const AuthContext = createContext<AuthContext>({
  accessToken: null,
  setAccessToken: () => {},
})

export const useAuthToken = () => {
  const { accessToken } = useContext(AuthContext)

  return accessToken
}

export const useSetAuthToken = () => {
  const { setAccessToken } = useContext(AuthContext)

  return setAccessToken
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}
