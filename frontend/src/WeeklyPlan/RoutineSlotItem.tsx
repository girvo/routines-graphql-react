import { graphql, useFragment, useMutation } from 'react-relay'
import { iconComponent } from '../utils/icons.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import type { RoutineSlotItem$key } from './__generated__/RoutineSlotItem.graphql.ts'
import type { RoutineSlotItemMutation } from './__generated__/RoutineSlotItemMutation.graphql.ts'
import styles from './RoutineSlotItem.module.css'
import { Button } from '../primitives/Button.tsx'
import { Tooltip } from '../primitives/overlay/Tooltip.tsx'
import { Loader, X } from 'lucide-react'
import { ConfirmDialog } from '../primitives/overlay/modal/ConfirmDialog.tsx'
import { Body } from '../primitives/text/Body.tsx'
import { useState } from 'react'

interface RoutineSlotItemProps {
  routineSlot: RoutineSlotItem$key
  connectionId: string
}

export const RoutineSlotItem = ({
  routineSlot: routineSlotRef,
  connectionId,
}: RoutineSlotItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
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

  const { showPayloadErrors, showError } = useMutationErrorHandler()

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

  const Icon = iconComponent(routineSlot.task.icon)

  return (
    <div className={styles.root}>
      <span className={styles.iconWrap} aria-hidden>
        <Icon className={styles.icon} />
      </span>
      <span className={styles.label}>{routineSlot.task.title}</span>
      <Tooltip label="Remove">
        <Button
          className={!isLoading ? styles.dangerHover : undefined}
          size="sm"
          variant="ghost"
          iconOnly={!isLoading ? X : Loader}
          aria-label="Remove"
          disabled={isLoading}
          onClick={() => setIsOpen(true)}
        />
      </Tooltip>
      <ConfirmDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          deleteItem({
            variables: {
              routineSlotId: routineSlot.id,
              connections: [connectionId],
            },
            optimisticResponse: {
              deleteRoutineSlot: { deletedId: routineSlot.id },
            },
            onCompleted: (_response, errors) => {
              showPayloadErrors(errors)
            },
            onError: showError,
          })
          setIsOpen(false)
        }}
        title="Are you sure?"
        destructive
      >
        <Body>
          Are you sure you want to remove "{routineSlot.task.title}" from this
          routine slot?
        </Body>
      </ConfirmDialog>
    </div>
  )
}
