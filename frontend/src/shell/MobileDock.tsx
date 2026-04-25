import type { ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import { Calendar1, CalendarDays, LayoutList } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './MobileDock.module.css'

type IconComponent = ComponentType<{ className?: string }>

type DockRoute = {
  to: string
  label: string
  icon: IconComponent
  end?: boolean
}

const routes: DockRoute[] = [
  { to: '/', label: 'Today', icon: Calendar1, end: true },
  { to: '/weekly', label: 'Weekly Plan', icon: CalendarDays },
  { to: '/tasks', label: 'Tasks', icon: LayoutList },
]

const tabClass = ({ isActive }: { isActive: boolean }) =>
  clsx(styles.tab, isActive && styles.tabActive)

export const MobileDock = () => (
  <nav className={styles.root}>
    {routes.map((route) => {
      const Icon = route.icon
      return (
        <NavLink key={route.to} to={route.to} end={route.end} className={tabClass}>
          <Icon className={styles.icon} />
          <span className={styles.label}>{route.label}</span>
        </NavLink>
      )
    })}
  </nav>
)
