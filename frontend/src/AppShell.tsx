import React, { use, useState, type Dispatch, type SetStateAction } from 'react'
import { AuthContext } from './auth/auth-store'
import { NavLink, Outlet, type UIMatch } from 'react-router'
import { useMatches } from 'react-router'

interface NavBarProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const NavBar = ({ setIsOpen }: NavBarProps) => {
  const matches = useMatches() as UIMatch<unknown, { title: string }>[]
  console.debug(matches)
  const currentTitle = matches
    .filter(match => match.handle?.title)
    .map(match => match.handle.title)
    .pop()

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <label
        htmlFor="my-drawer-3"
        className="drawer-button flex-none lg:hidden"
        aria-label="Open menu"
      >
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            {' '}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>{' '}
          </svg>
        </button>
      </label>
      <div className="flex-1 pl-4">
        <a className="text-xl">{currentTitle ?? 'Routines'}</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            {' '}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>{' '}
          </svg>
        </button>
      </div>
    </div>
  )
}

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
        readOnly
      />
      <div className="drawer-content flex flex-col items-center justify-center lg:justify-start">
        <NavBar setIsOpen={setIsOpen} />
        <Outlet />
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
