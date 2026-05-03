import type { ReactNode } from 'react'
import { Card } from '../primitives/layout/Card.tsx'
import styles from './PlannerCard.module.css'

interface PlannerCardProps {
  header: ReactNode
  children: ReactNode
  empty?: ReactNode
}

export const PlannerCard = ({ header, children, empty }: PlannerCardProps) => (
  <Card className={styles.layout}>
    {header}
    <div className={styles.divider} />
    <div className={styles.body}>
      {empty ?? children}
    </div>
  </Card>
)

export const PlannerCardEmpty = ({ children }: { children: ReactNode }) => (
  <div className={styles.empty}>{children}</div>
)
