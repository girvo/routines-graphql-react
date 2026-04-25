import { Suspense, type ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import {
  graphql,
  useFragment,
  usePreloadedQuery,
  type PreloadedQuery,
} from 'react-relay'
import { Calendar1, CalendarDays, LayoutList, Settings, LogOut } from 'lucide-react'
import { Avatar } from '../primitives/Avatar.tsx'
import { clsx } from 'clsx'
import type { DesktopSidebarQuery } from './__generated__/DesktopSidebarQuery.graphql.ts'
import type { DesktopSidebar_me$key } from './__generated__/DesktopSidebar_me.graphql'
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

const UserCardSkeleton = () => (
  <div className={styles.userCard} aria-hidden="true">
    <Avatar initials="" />
    <div className={styles.userCol}>
      <span className={styles.userName}>&nbsp;</span>
      <span className={styles.userEmail}>&nbsp;</span>
    </div>
  </div>
)

type LoadedUserCardProps = { user: PreloadedQuery<DesktopSidebarQuery> }

const LoadedUserCard = ({ user }: LoadedUserCardProps) => {
  const data = usePreloadedQuery<DesktopSidebarQuery>(
    graphql`
      query DesktopSidebarQuery {
        me {
          ...DesktopSidebar_me
        }
      }
    `,
    user,
  )
  return <UserCardFromFragment me={data.me} />
}

const UserCardFromFragment = ({ me }: { me: DesktopSidebar_me$key }) => {
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
  return <UserCard name={data.name} email={data.email} initials={data.initials} />
}

const itemClass = ({ isActive }: { isActive: boolean }) =>
  clsx(styles.item, isActive && styles.itemActive)

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
  user: PreloadedQuery<DesktopSidebarQuery> | null | undefined
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

    {user ? (
      <Suspense fallback={<UserCardSkeleton />}>
        <LoadedUserCard user={user} />
      </Suspense>
    ) : (
      <UserCardSkeleton />
    )}
  </nav>
)
