import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  title: string
  count?: number | string
  action?: ReactNode
  dense?: boolean
}

export const SectionHeader = ({ title, count, action, dense }: SectionHeaderProps) => (
  <div className={clsx(styles.root, dense && styles.dense)}>
    <div className={styles.hl}>
      <span className={styles.title}>{title}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </div>
    {action}
  </div>
)
