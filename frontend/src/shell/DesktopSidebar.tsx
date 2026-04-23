import type { ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import { Calendar1, CalendarDays, LayoutList, Settings, LogOut } from 'lucide-react'
import { Avatar } from '../primitives/Avatar.tsx'
import { cn } from '../utils/tailwind.ts'
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

const secondaryRoutes: NavRoute[] = [{ to: '/settings', label: 'Settings', icon: Settings }]

type UserCardProps = {
  name: string
  email: string
  initials: string
}

const UserCard = ({ name, email, initials }: UserCardProps) => (
  <div className={styles.userCard}>
    <Avatar initials={initials} />
    <div className={styles.userCol}>
      <span className={styles.userName}>{name}</span>
      <span className={styles.userEmail}>{email}</span>
    </div>
  </div>
)

const itemClass = ({ isActive }: { isActive: boolean }) =>
  cn(styles.item, isActive && styles.itemActive)

type NavItemLinkProps = { route: NavRoute }

const NavItemLink = ({ route }: NavItemLinkProps) => {
  const Icon = route.icon
  return (
    <NavLink to={route.to} end={route.end} className={itemClass}>
      <Icon className={styles.itemIcon} />
      <span>{route.label}</span>
    </NavLink>
  )
}

type DesktopSidebarProps = {
  user: UserCardProps
  onLogout: () => void
}

export const DesktopSidebar = ({ user, onLogout }: DesktopSidebarProps) => (
  <nav className={styles.root}>
    <div className={styles.brand}>
      <span className={styles.brandLogo}>R</span>
      <span className={styles.brandName}>Routines</span>
    </div>

    <div className={styles.nav}>
      {primaryRoutes.map((route) => (
        <NavItemLink key={route.to} route={route} />
      ))}
    </div>

    <hr className={styles.divider} />

    <div className={styles.nav}>
      {secondaryRoutes.map((route) => (
        <NavItemLink key={route.to} route={route} />
      ))}
      <button type="button" className={styles.item} onClick={onLogout}>
        <LogOut className={styles.itemIcon} />
        <span>Logout</span>
      </button>
    </div>

    <div className={styles.spacer} />

    <UserCard {...user} />
  </nav>
)
