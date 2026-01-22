import { use, useMemo, useRef, useLayoutEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useRelayEnvironment } from 'react-relay'
import { preparePreloadableRoutes } from '@loop-payments/react-router-relay'
import { AuthContext } from './auth/auth-store'
import { authedRouteConfig, unAuthedRouteConfig } from './routes.tsx'

export default function App() {
  const { hasAccessToken } = use(AuthContext)
  const environment = useRelayEnvironment()
  const environmentRef = useRef(environment)

  useLayoutEffect(() => {
    environmentRef.current = environment
  }, [environment])

  /* eslint-disable react-hooks/refs -- getEnvironment is called during navigation, not render */
  const authedRouter = useMemo(() => {
    const routes = preparePreloadableRoutes(authedRouteConfig, {
      getEnvironment: () => environmentRef.current,
    })
    return createBrowserRouter(routes)
  }, [])
  /* eslint-enable react-hooks/refs */

  const unauthedRouter = useMemo(() => {
    return createBrowserRouter(unAuthedRouteConfig)
  }, [])

  if (!hasAccessToken) {
    return <RouterProvider router={unauthedRouter} />
  }

  return <RouterProvider router={authedRouter} />
}
