import {
  Suspense,
  use,
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import {
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  type UIMatch,
} from 'react-router-dom'
import { useQueryLoader } from 'react-relay'
import { AuthContext } from './auth/auth-store.ts'
import {
  PageHeaderContext,
  type PageHeaderSlots,
} from './utils/page-header.ts'
import { AppShellFrame } from './shell/AppShellFrame.tsx'
import { DesktopSidebar } from './shell/DesktopSidebar.tsx'
import { MobileDock } from './shell/MobileDock.tsx'
import { TopBar } from './shell/TopBar.tsx'
import DesktopSidebarQueryNode from './shell/__generated__/DesktopSidebarQuery.graphql.ts'
import type { DesktopSidebarQuery } from './shell/__generated__/DesktopSidebarQuery.graphql.ts'

interface RouteHandle {
  title?: string
  subtitle?: string
  loading?: () => ReactNode
}

type TopBarSlotProps = {
  title: string
  routeSubtitle?: ReactNode
  onLogout: () => void
}

const TopBarSlot = ({ title, routeSubtitle, onLogout }: TopBarSlotProps) => {
  const { subtitle, actions } = use(PageHeaderContext)
  return (
    <TopBar
      title={title}
      subtitle={subtitle ?? routeSubtitle}
      actions={actions}
      onLogout={onLogout}
    />
  )
}

const BelowHeaderSlot = () => {
  const { belowHeader } = use(PageHeaderContext)
  return <>{belowHeader}</>
}

export const AppShell = () => {
  const [slots, setSlotsState] = useState<PageHeaderSlots>({
    subtitle: null,
    actions: null,
    belowHeader: null,
  })
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[]
  const location = useLocation()
  const navigate = useNavigate()
  const { clearAccessToken } = use(AuthContext)

  const handleLogout = useCallback(() => {
    void fetch('/api/logout', {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
    })
    clearAccessToken()
    navigate('/', { replace: true })
  }, [clearAccessToken, navigate])

  const [user, loadUser] = useQueryLoader<DesktopSidebarQuery>(DesktopSidebarQueryNode)

  // TODO: promote AppShell to an EntryPointRouteObject (see TasksPage.entrypoint.ts for
  // the pattern) so the user query fires during route resolution, before this component
  // renders. Until then, useState's lazy initializer fires loadUser on the first render
  // body — earlier than useEffect/useLayoutEffect, which both run post-commit.
  useState(() => {
    loadUser({})
    return null
  })

  const title = matches.findLast((m) => m.handle?.title)?.handle?.title ?? 'Routines'
  const routeSubtitle = matches.findLast((m) => m.handle?.subtitle)?.handle?.subtitle
  const Loading = matches.findLast((m) => m.handle?.loading)?.handle?.loading

  const setSlots = useCallback((next: Partial<PageHeaderSlots>) => {
    setSlotsState((prev) => ({ ...prev, ...next }))
  }, [])

  const clearSlots = useCallback((keys: Array<keyof PageHeaderSlots>) => {
    setSlotsState((prev) => {
      const next = { ...prev }
      for (const key of keys) next[key] = null
      return next
    })
  }, [])

  return (
    <PageHeaderContext value={{ ...slots, setSlots, clearSlots }}>
      <AppShellFrame
        sidebar={<DesktopSidebar user={user} onLogout={handleLogout} />}
        topBar={<TopBarSlot title={title} routeSubtitle={routeSubtitle} onLogout={handleLogout} />}
        belowHeader={<BelowHeaderSlot />}
        dock={<MobileDock />}
      >
        <Suspense
          key={location.pathname}
          fallback={Loading ? <Loading /> : 'Loading...'}
        >
          <Outlet />
        </Suspense>
      </AppShellFrame>
    </PageHeaderContext>
  )
}
