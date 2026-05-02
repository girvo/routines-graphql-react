import { DynamicIcon } from 'lucide-react/dynamic'
import { graphql, useFragment, useMutation } from 'react-relay'
import { parseIconName } from '../utils/icons.ts'
import type { RoutineSlotItem$key } from './__generated__/RoutineSlotItem.graphql.ts'
import type { RoutineSlotItemMutation } from './__generated__/RoutineSlotItemMutation.graphql.ts'
import styles from './RoutineSlotItem.module.css'
import { Button } from '../primitives/Button.tsx'
import { Tooltip } from '../primitives/overlay/Tooltip.tsx'
import { Loader, X } from 'lucide-react'

interface RoutineSlotItemProps {
  routineSlot: RoutineSlotItem$key
  connectionId: string
}

export const RoutineSlotItem = ({
  routineSlot: routineSlotRef,
  connectionId,
}: RoutineSlotItemProps) => {
  const routineSlot = useFragment(
    graphql`
      fragment RoutineSlotItem on RoutineSlot {
        id
        task {
          title
          icon
        }
      }
    `,
    routineSlotRef,
  )
  const { task } = routineSlot

  const [deleteItem, isLoading] = useMutation<RoutineSlotItemMutation>(graphql`
    mutation RoutineSlotItemMutation(
      $routineSlotId: ID!
      $connections: [ID!]!
    ) {
      deleteRoutineSlot(routineSlotId: $routineSlotId) {
        deletedId @deleteEdge(connections: $connections)
      }
    }
  `)

  return (
    <div className={styles.root}>
      <span className={styles.iconWrap} aria-hidden>
        <DynamicIcon name={parseIconName(task.icon)} className={styles.icon} />
      </span>
      <span className={styles.label}>{task.title}</span>
      <Tooltip label="Remove">
        <Button
          className={!isLoading ? styles.dangerHover : undefined}
          size="sm"
          variant="ghost"
          iconOnly={!isLoading ? X : Loader}
          aria-label="Remove"
          disabled={isLoading}
          onClick={() => {
            if (isLoading) return

            deleteItem({
              variables: {
                routineSlotId: routineSlot.id,
                connections: [connectionId],
              },
            })
          }}
        />
      </Tooltip>
    </div>
  )
}
