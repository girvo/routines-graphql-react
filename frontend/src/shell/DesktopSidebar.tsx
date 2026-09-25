import type { ComponentType } from 'react'
import { graphql, useFragment } from 'react-relay'
import {
  Calendar1,
  CalendarDays,
  LayoutList,
  LogOut,
  Settings,
} from 'lucide-react'
import { Avatar } from '../primitives/Avatar.tsx'
import { clsx } from 'clsx'
import type { DesktopSidebar_me$key } from './__generated__/DesktopSidebar_me.graphql'
import { PreloadingNavLink } from './PreloadingNavLink.tsx'
import styles from './DesktopSidebar.module.css'

type IconComponent = ComponentType<{ className?: string }>

type NavRoute = {
  to: string
  label: string
  icon: IconComponent
  end?: boolean
}

const primaryRoutes: NavRoute[] = [
  { to: '/', label: 'Today', icon: Calendar1, end: true },
  { to: '/weekly', label: 'Weekly Plan', icon: CalendarDays },
  { to: '/tasks', label: 'All Tasks', icon: LayoutList },
]

const UserCard = ({ me }: { me: DesktopSidebar_me$key }) => {
  const data = useFragment(
    graphql`
      fragment DesktopSidebar_me on User {
        name
        email
        initials
      }
    `,
    me,
  )
  return (
    <div className={styles.userCard}>
      <Avatar initials={data.initials} />
      <div className={styles.userCol}>
        <span className={styles.userName}>{data.name}</span>
        <span className={styles.userEmail}>{data.email}</span>
      </div>
    </div>
  )
}

const itemClass = ({ isActive }: { isActive: boolean }) =>
  clsx(styles.item, isActive && styles.itemActive)

type NavItemLinkProps = { route: NavRoute }

const NavItemLink = ({ route }: NavItemLinkProps) => {
  const Icon = route.icon
  return (
    <PreloadingNavLink to={route.to} end={route.end} className={itemClass}>
      <Icon className={styles.itemIcon} />
      <span>{route.label}</span>
    </PreloadingNavLink>
  )
}

type DesktopSidebarProps = {
  me: DesktopSidebar_me$key
  onLogout: () => void
}

export const DesktopSidebar = ({ me, onLogout }: DesktopSidebarProps) => (
  <nav className={styles.root}>
    <div className={styles.brand}>
      <span className={styles.brandLogo}>R</span>
      <span className={styles.brandName}>Routines</span>
    </div>

    <div className={styles.nav}>
      {primaryRoutes.map(route => (
        <NavItemLink key={route.to} route={route} />
      ))}
    </div>

    <hr className={styles.divider} />

    <div className={styles.nav}>
      <PreloadingNavLink to="/settings" className={itemClass}>
        <Settings className={styles.itemIcon} />
        <span>Settings</span>
      </PreloadingNavLink>
      <button type="button" className={styles.item} onClick={onLogout}>
        <LogOut className={styles.itemIcon} />
        <span>Logout</span>
      </button>
    </div>

    <div className={styles.spacer} />

    <UserCard me={me} />
  </nav>
)
