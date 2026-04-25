import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { MoreVertical, Settings, LogOut } from 'lucide-react'
import { Button } from '../primitives/Button.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover/Popover.tsx'
import styles from './TopBar.module.css'

type TopBarProps = {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  onLogout: () => void
}

export const TopBar = ({ title, subtitle, actions, onLogout }: TopBarProps) => (
  <header className={styles.root}>
    <div className={styles.titleCol}>
      <span className={styles.title}>{title}</span>
      {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
    </div>
    <div className={styles.trailing}>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      <div className={styles.overflow}>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button variant="ghost" iconOnly={MoreVertical} aria-label="More actions" />
          </PopoverTrigger>
          <PopoverContent className={styles.menu}>
            <NavLink to="/settings" className={styles.menuItem}>
              <Settings className={styles.menuIcon} />
              <span>Settings</span>
            </NavLink>
            <button type="button" className={styles.menuItem} onClick={onLogout}>
              <LogOut className={styles.menuIcon} />
              <span>Logout</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </header>
)
