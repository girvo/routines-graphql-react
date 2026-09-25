import { createElement, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { graphql, useFragment, useMutation } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
import { iconComponent } from '../utils/icons.ts'
import { announceMove } from './announce-move.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import type { DaySectionMove } from './DaySectionMoveTask.ts'
import {
  applyMove,
  moveTargetForCommand,
  type MoveCommand,
} from './task-order.ts'
import type { RoutineSlotItem_routineSlot$key } from './__generated__/RoutineSlotItem_routineSlot.graphql.ts'
import type { RoutineSlotItemMutation } from './__generated__/RoutineSlotItemMutation.graphql.ts'
import styles from './RoutineSlotItem.module.css'
import { Button } from '../primitives/Button.tsx'
import { Tooltip } from '../primitives/overlay/Tooltip.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  type PopoverOpenSource,
} from '../primitives/overlay/popover/Popover.tsx'
import { GripVertical, Loader, X } from 'lucide-react'
import { ConfirmDialog } from '../primitives/overlay/modal/ConfirmDialog.tsx'
import { Body } from '../primitives/text/Body.tsx'

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([disabled])'

const MOVE_COMMANDS = [
  { command: 'up', label: 'Move up' },
  { command: 'down', label: 'Move down' },
  { command: 'top', label: 'Move to top' },
  { command: 'bottom', label: 'Move to bottom' },
] as const

interface RoutineSlotItemProps {
  routineSlot: RoutineSlotItem_routineSlot$key
  connectionId: string
  move: DaySectionMove
}

export const RoutineSlotItem = ({
  routineSlot: routineSlotRef,
  connectionId,
  move,
}: RoutineSlotItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMoveOpen, setIsMoveOpen] = useState(false)
  const [moveOpenedViaKeyboard, setMoveOpenedViaKeyboard] = useState(false)
  const moveButtonRef = useRef<HTMLButtonElement>(null)
  const moveMenuRef = useRef<HTMLDivElement>(null)
  const routineSlot = useFragment(
    graphql`
      fragment RoutineSlotItem_routineSlot on RoutineSlot {
        id
        task {
          id
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

  const title = routineSlot.task.title
  const canMove = move.slotIds.length > 1
  const targetFor = (command: MoveCommand) =>
    moveTargetForCommand(move.slotIds, routineSlot.id, command)

  useEffect(() => {
    if (!isMoveOpen) return
    if (moveOpenedViaKeyboard) {
      moveMenuRef.current
        ?.querySelector<HTMLButtonElement>(MENU_ITEM_SELECTOR)
        ?.focus()
      return
    }
    moveMenuRef.current?.focus()
  }, [isMoveOpen, moveOpenedViaKeyboard])

  const handleMoveMenuOpenChange = (
    open: boolean,
    source: PopoverOpenSource,
  ) => {
    setIsMoveOpen(open)
    setMoveOpenedViaKeyboard(open && source === 'keyboard')
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = [
      ...(moveMenuRef.current?.querySelectorAll<HTMLButtonElement>(
        MENU_ITEM_SELECTOR,
      ) ?? []),
    ]
    if (items.length === 0) return
    const current = items.indexOf(document.activeElement as HTMLButtonElement)
    let next = -1
    if (event.key === 'ArrowDown') {
      next = current < 0 ? 0 : (current + 1) % items.length
    } else if (event.key === 'ArrowUp') {
      next =
        current < 0
          ? items.length - 1
          : (current - 1 + items.length) % items.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = items.length - 1
    } else if (event.key === 'Tab' && current < 0) {
      next = event.shiftKey ? items.length - 1 : 0
    }
    if (next < 0) return
    event.preventDefault()
    items[next]?.focus()
  }

  const handleMoveCommand = (command: MoveCommand) => {
    const target = targetFor(command)
    setIsMoveOpen(false)
    moveButtonRef.current?.focus()
    if (!target) return

    const nextOrder = applyMove(move.slotIds, routineSlot.id, target)
    move.moveSlot(routineSlot.id, target)
    announceMove({
      title,
      movedId: routineSlot.id,
      target,
      nextOrder,
    })
  }

  return (
    <div className={styles.root}>
      <span className={styles.iconWrap} aria-hidden>
        {createElement(iconComponent(routineSlot.task.icon), {
          className: styles.icon,
        })}
      </span>
      <span className={styles.label}>{title}</span>
      {canMove && (
        <Popover
          open={isMoveOpen}
          onOpenChange={handleMoveMenuOpenChange}
          placement="bottom-end"
        >
          <PopoverTrigger>
            <Tooltip label="Move">
              <Button
                ref={moveButtonRef}
                size="sm"
                variant="ghost"
                iconOnly={GripVertical}
                aria-label={`Move ${title}`}
                className={styles.gripControl}
                data-slot-drag-handle="true"
              />
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent label={`Move ${title}`}>
            <div
              ref={moveMenuRef}
              role="menu"
              aria-label={`Move ${title}`}
              className={styles.moveMenu}
              tabIndex={-1}
              onKeyDown={handleMenuKeyDown}
            >
              {MOVE_COMMANDS.map(({ command, label }) => (
                <Button
                  key={command}
                  role="menuitem"
                  size="sm"
                  variant="ghost"
                  align="start"
                  fullWidth
                  disabled={move.isMoving || !targetFor(command)}
                  onClick={() => handleMoveCommand(command)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
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
              connections: [
                connectionId,
                ConnectionHandler.getConnectionID(
                  routineSlot.task.id,
                  'Task_slots',
                ),
              ],
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
          Are you sure you want to remove &quot;{title}&quot; from this routine
          slot?
        </Body>
      </ConfirmDialog>
    </div>
  )
}
