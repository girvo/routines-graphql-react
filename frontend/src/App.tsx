import { use } from 'react'
import { AuthContext } from './auth/auth-store'
import { RouterProvider } from 'react-router'
import { routes, unAuthedRoutes } from './routes.tsx'

export default function App() {
  const { hasAccessToken } = use(AuthContext)

  if (!hasAccessToken) {
    return <RouterProvider router={unAuthedRoutes} />
  }

  return <RouterProvider router={routes} />
}
