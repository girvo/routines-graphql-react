import { use, useState } from 'react'
import { AuthContext } from './auth/auth-store'
import { cn } from './utils/tailwind'
import { NavLink } from 'react-router'

export const AppShell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { clearAccessToken } = use(AuthContext)

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
      />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-3"
          className="btn drawer-button lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setIsOpen(false)}
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 max-w-[85vw] gap-2 p-4">
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-active' : '')}
              onClick={() => setIsOpen(false)}
              to="/"
            >
              Today
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? 'menu-active' : '')}
              onClick={() => setIsOpen(false)}
              to="/tasks"
            >
              All tasks
            </NavLink>
          </li>
          <span className="divider mt-0 mb-0" />
          <li>
            <a onClick={clearAccessToken}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
