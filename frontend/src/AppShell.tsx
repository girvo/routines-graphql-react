import { Suspense, use, useState, useCallback } from 'react'
import { AuthContext } from './auth/auth-store.ts'
import {
  NavLink,
  Outlet,
  useLocation,
  useMatches,
  type UIMatch,
} from 'react-router-dom'
import {
  Calendar1,
  CalendarDays,
  EllipsisVertical,
  LayoutList,
} from 'lucide-react'
import {
  HeaderActionsContext,
  type HeaderAction,
} from './utils/header-actions.ts'

interface RouteHandle {
  title?: string
  loading?: () => React.ReactNode
}

const Header = () => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[]
  const currentTitle = matches
    .filter(match => match.handle?.title)
    .map(match => match.handle.title)
    .pop()

  const { clearAccessToken } = use(AuthContext)
  const { actions } = use(HeaderActionsContext)

  return (
    <div className="navbar bg-neutral text-neutral-content shadow-sm">
      <div className="flex-1 pl-4">
        <span className="text-xl">{currentTitle ?? 'Routines'}</span>
      </div>
      <div className="flex gap-1 pr-4">
        {actions.map(action => (
          <button
            key={action.id}
            className="btn btn-outline pr-2.5 pl-1.5"
            onClick={action.onClick}
          >
            <action.icon className="h-5 w-5 translate-y-px" />
            {action.label}
          </button>
        ))}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
            <EllipsisVertical className="h-5 w-5 translate-y-px" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-200 text-base-content rounded-box z-10 w-52 p-2 shadow-sm"
          >
            <li>
              <NavLink to="/settings">Settings</NavLink>
            </li>
            <li>
              <a onClick={clearAccessToken}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const MobileDock = () => (
  <div className="dock lg:hidden">
    <NavLink
      to="/"
      className={({ isActive }) => (isActive ? 'dock-active text-primary' : '')}
    >
      <Calendar1 />
      <span className="dock-label">Today</span>
    </NavLink>
    <NavLink
      to="/weekly"
      className={({ isActive }) => (isActive ? 'dock-active text-primary' : '')}
    >
      <CalendarDays />
      <span className="dock-label">Weekly plan</span>
    </NavLink>
    <NavLink
      to="/tasks"
      className={({ isActive }) => (isActive ? 'dock-active text-primary' : '')}
    >
      <LayoutList />
      <span className="dock-label">Tasks</span>
    </NavLink>
  </div>
)

const DesktopSidebar = () => {
  const { clearAccessToken } = use(AuthContext)

  return (
    <aside className="bg-base-200 hidden min-h-screen w-80 shrink-0 lg:flex lg:flex-col">
      <ul className="menu w-full gap-2 p-4">
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'menu-active' : '')}
            to="/"
          >
            Today
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'menu-active' : '')}
            to="/weekly"
          >
            Weekly plan
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'menu-active' : '')}
            to="/tasks"
          >
            All tasks
          </NavLink>
        </li>
        <span className="divider mt-0 mb-0" />
        <li>
          <NavLink to="/settings">Settings</NavLink>
        </li>
        <li>
          <a onClick={clearAccessToken}>Logout</a>
        </li>
      </ul>
    </aside>
  )
}

export const AppShell = () => {
  const [actions, setActionsState] = useState<HeaderAction[]>([])
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[]
  const location = useLocation()
  const Loading = matches.findLast(m => m.handle?.loading)?.handle?.loading

  const setActions = useCallback((newActions: HeaderAction[]) => {
    setActionsState(newActions)
  }, [])

  const clearActions = useCallback(() => {
    setActionsState([])
  }, [])

  return (
    <HeaderActionsContext value={{ actions, setActions, clearActions }}>
      <div className="flex min-h-screen">
        <DesktopSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1">
            <Suspense
              key={location.pathname}
              fallback={Loading ? <Loading /> : 'Loading...'}
            >
              <Outlet />
            </Suspense>
          </main>
          <MobileDock />
        </div>
      </div>
    </HeaderActionsContext>
  )
}
