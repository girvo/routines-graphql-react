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
import { handleEscapeBlur } from './utils/form.ts'
import { cn } from './utils/tailwind.ts'
import styles from './AppShell.module.css'

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
    <div className={styles.navbar}>
      <span className={styles.title}>{currentTitle ?? 'Routines'}</span>
      <div className={styles.actions}>
        {actions.map(action => (
          <button
            key={action.id}
            className={styles.actionButton}
            onClick={action.onClick}
          >
            <action.icon className={styles.actionIcon} />
            {action.label}
          </button>
        ))}
        <div className={styles.dropdown}>
          <div
            tabIndex={0}
            role="button"
            className={styles.dropdownTrigger}
          >
            <EllipsisVertical className={styles.actionIcon} />
          </div>
          <ul
            tabIndex={0}
            className={styles.dropdownMenu}
            onKeyDown={handleEscapeBlur}
          >
            <li>
              <NavLink to="/settings" className={styles.dropdownItem}>
                Settings
              </NavLink>
            </li>
            <li>
              <a className={styles.dropdownItem} onClick={clearAccessToken}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const dockItemClass = ({ isActive }: { isActive: boolean }) =>
  cn(styles.dockItem, isActive && styles.dockItemActive)

const MobileDock = () => (
  <nav className={styles.dock}>
    <NavLink to="/" className={dockItemClass} end>
      <Calendar1 />
      <span className={styles.dockLabel}>Today</span>
    </NavLink>
    <NavLink to="/weekly" className={dockItemClass}>
      <CalendarDays />
      <span className={styles.dockLabel}>Weekly plan</span>
    </NavLink>
    <NavLink to="/tasks" className={dockItemClass}>
      <LayoutList />
      <span className={styles.dockLabel}>Tasks</span>
    </NavLink>
  </nav>
)

const sidebarItemClass = ({ isActive }: { isActive: boolean }) =>
  cn(styles.sidebarItem, isActive && styles.sidebarItemActive)

const DesktopSidebar = () => {
  const { clearAccessToken } = use(AuthContext)

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.sidebarNav}>
        <li>
          <NavLink className={sidebarItemClass} to="/" end>
            Today
          </NavLink>
        </li>
        <li>
          <NavLink className={sidebarItemClass} to="/weekly">
            Weekly plan
          </NavLink>
        </li>
        <li>
          <NavLink className={sidebarItemClass} to="/tasks">
            All tasks
          </NavLink>
        </li>
        <li>
          <span className={styles.divider} />
        </li>
        <li>
          <NavLink className={sidebarItemClass} to="/settings">
            Settings
          </NavLink>
        </li>
        <li>
          <a className={styles.sidebarItem} onClick={clearAccessToken}>
            Logout
          </a>
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
      <div className={styles.shell}>
        <DesktopSidebar />
        <div className={styles.content}>
          <Header />
          <main className={styles.main}>
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
