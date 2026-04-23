import type { ReactNode } from 'react'
import styles from './AppShell.module.css'

type AppShellProps = {
  sidebar?: ReactNode
  topBar?: ReactNode
  dock?: ReactNode
  children: ReactNode
}

export const AppShell = ({ sidebar, topBar, dock, children }: AppShellProps) => (
  <div className={styles.shell}>
    {sidebar ? <aside className={styles.sidebar}>{sidebar}</aside> : null}
    <div className={styles.content}>
      {topBar ? <div className={styles.topBar}>{topBar}</div> : null}
      <main className={styles.main}>{children}</main>
      {dock ? <div className={styles.dock}>{dock}</div> : null}
    </div>
  </div>
)
