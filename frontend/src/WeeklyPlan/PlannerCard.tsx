import type { ReactNode } from 'react'
import styles from './PlannerCard.module.css'

interface PlannerCardProps {
  header: ReactNode
  children: ReactNode
  empty?: ReactNode
}

export const PlannerCard = ({ header, children, empty }: PlannerCardProps) => (
  <div className={styles.card}>
    {header}
    <div className={styles.divider} />
    <div className={styles.body}>
      {empty ?? children}
    </div>
  </div>
)

export const PlannerCardEmpty = ({ children }: { children: ReactNode }) => (
  <div className={styles.empty}>{children}</div>
)
