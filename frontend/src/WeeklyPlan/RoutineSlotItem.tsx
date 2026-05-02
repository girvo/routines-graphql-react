import { DynamicIcon } from 'lucide-react/dynamic'
import { graphql, useFragment } from 'react-relay'
import { parseIconName } from '../utils/icons.ts'
import type { RoutineSlotItem$key } from './__generated__/RoutineSlotItem.graphql.ts'
import styles from './RoutineSlotItem.module.css'
import { Button } from '../primitives/Button.tsx'
import { Tooltip } from '../primitives/Tooltip.tsx'
import { X } from 'lucide-react'

interface RoutineSlotItemProps {
  task: RoutineSlotItem$key
}

export const RoutineSlotItem = ({ task: taskRef }: RoutineSlotItemProps) => {
  const task = useFragment(
    graphql`
      fragment RoutineSlotItem on Task {
        id
        title
        icon
      }
    `,
    taskRef,
  )

  return (
    <div className={styles.root}>
      <span className={styles.iconWrap} aria-hidden>
        <DynamicIcon name={parseIconName(task.icon)} className={styles.icon} />
      </span>
      <span className={styles.label}>{task.title}</span>
      <Tooltip label="Remove">
        <Button
          className={styles.dangerHover}
          size="sm"
          variant="ghost"
          iconOnly={X}
          aria-label="Remove"
        />
      </Tooltip>
    </div>
  )
}
