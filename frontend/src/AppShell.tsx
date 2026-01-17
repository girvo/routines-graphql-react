import { use } from 'react'
import { AuthContext } from './auth/auth-store.ts'
import { NavLink, Outlet, type UIMatch } from 'react-router'
import { useMatches } from 'react-router'
import {
  Calendar1,
  CalendarDays,
  EllipsisVertical,
  LayoutList,
} from 'lucide-react'

const Header = () => {
  const matches = useMatches() as UIMatch<unknown, { title: string }>[]
  const currentTitle = matches
    .filter(match => match.handle?.title)
    .map(match => match.handle.title)
    .pop()

  const { clearAccessToken } = use(AuthContext)

  return (
    <div className="navbar bg-neutral shadow-sm lg:hidden">
      <div className="flex-1 pl-4">
        <span className="text-xl">{currentTitle ?? 'Routines'}</span>
      </div>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
          <EllipsisVertical className="h-5 w-5" />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-200 rounded-box z-10 w-52 p-2 shadow-sm"
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
      <span className="dock-label">Weekly Plan</span>
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

export const AppShell = () => (
  <div className="flex min-h-screen">
    <DesktopSidebar />
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <MobileDock />
    </div>
  </div>
)
