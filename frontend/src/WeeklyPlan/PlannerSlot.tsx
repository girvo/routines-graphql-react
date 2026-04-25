import { DynamicIcon } from 'lucide-react/dynamic'
import { parseIconName } from '../utils/icons.ts'
import styles from './PlannerSlot.module.css'

interface PlannerSlotProps {
  title: string
  icon: string | null | undefined
}

export const PlannerSlot = ({ title, icon }: PlannerSlotProps) => (
  <div className={styles.root}>
    <span className={styles.iconWrap} aria-hidden>
      <DynamicIcon name={parseIconName(icon)} className={styles.icon} />
    </span>
    <span className={styles.label}>{title}</span>
  </div>
)
