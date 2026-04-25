import type { ReactNode } from 'react'
import styles from './AppShellFrame.module.css'

type AppShellFrameProps = {
  sidebar?: ReactNode
  topBar?: ReactNode
  belowHeader?: ReactNode
  dock?: ReactNode
  children: ReactNode
}

export const AppShellFrame = ({
  sidebar,
  topBar,
  belowHeader,
  dock,
  children,
}: AppShellFrameProps) => (
  <div className={styles.shell}>
    {sidebar ? <aside className={styles.sidebar}>{sidebar}</aside> : null}
    <div className={styles.content}>
      {topBar ? <div className={styles.topBar}>{topBar}</div> : null}
      {belowHeader ? <div className={styles.belowHeader}>{belowHeader}</div> : null}
      <main className={styles.main}>{children}</main>
      {dock ? <div className={styles.dock}>{dock}</div> : null}
    </div>
  </div>
)
