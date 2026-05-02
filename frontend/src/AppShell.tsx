import {
  Suspense,
  use,
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import {
  Outlet,
  useMatches,
  useNavigate,
  type UIMatch,
} from 'react-router-dom'
import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import { AuthContext } from './auth/auth-store.ts'
import {
  PageHeaderContext,
  type PageHeaderSlots,
} from './utils/page-header.ts'
import { AppShellFrame } from './shell/AppShellFrame.tsx'
import { DesktopSidebar } from './shell/DesktopSidebar.tsx'
import { MobileDock } from './shell/MobileDock.tsx'
import { TopBar } from './shell/TopBar.tsx'
import type { DesktopSidebarQuery } from './shell/__generated__/DesktopSidebarQuery.graphql.ts'

interface RouteHandle {
  title?: string
  subtitle?: string
  loading?: () => ReactNode
}

type TopBarSlotProps = {
  routeTitle: string
  routeSubtitle?: ReactNode
  onLogout: () => void
}

const TopBarSlot = ({ routeTitle, routeSubtitle, onLogout }: TopBarSlotProps) => {
  const { title, subtitle, actions } = use(PageHeaderContext)
  return (
    <TopBar
      title={title ?? routeTitle}
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

type Props = SimpleEntryPointProps<{ userQuery: DesktopSidebarQuery }>

const AppShell = ({ queries }: Props) => {
  const [slots, setSlotsState] = useState<PageHeaderSlots>({
    subtitle: null,
    actions: null,
    belowHeader: null,
  })
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[]
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

  const routeTitle = matches.findLast((m) => m.handle?.title)?.handle?.title ?? 'Routines'
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
        sidebar={<DesktopSidebar user={queries.userQuery} onLogout={handleLogout} />}
        topBar={<TopBarSlot routeTitle={routeTitle} routeSubtitle={routeSubtitle} onLogout={handleLogout} />}
        belowHeader={<BelowHeaderSlot />}
        dock={<MobileDock />}
      >
        <Suspense fallback={Loading ? <Loading /> : 'Loading...'}>
          <Outlet />
        </Suspense>
      </AppShellFrame>
    </PageHeaderContext>
  )
}

export default AppShell
