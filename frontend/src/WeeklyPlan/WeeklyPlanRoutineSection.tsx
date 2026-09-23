import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { graphql, useFragment } from 'react-relay'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter'
import type { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter'
import type { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/types'
import {
  attachInstruction,
  extractInstruction,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/list-item'
import type { Instruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/list-item'
import { RoutineSlotItem } from './RoutineSlotItem.tsx'
import { useDaySectionMoveTask } from './DaySectionMoveTask.ts'
import { useSlotTouchDrag, type SlotDropAnchor } from './SlotTouchDrag.ts'
import type { DaySectionMove } from './DaySectionMoveTask.ts'
import { announceMove } from './announce-move.ts'
import {
  applyMove,
  moveTargetForDrop,
  type DropRelation,
} from './task-order.ts'
import type { DayOfWeek } from './days.ts'
import styles from './WeeklyPlanRoutineSection.module.css'
import type { RoutineSlotItem_routineSlot$key } from './__generated__/RoutineSlotItem_routineSlot.graphql.ts'
import type { WeeklyPlanRoutineSection_section$key } from './__generated__/WeeklyPlanRoutineSection_section.graphql'

interface DraggedSlot {
  slotId: string
  title: string
}

interface DragContext {
  listId: string
  move: DaySectionMove
}

interface SortableSlot {
  id: string
  title: string
  routineSlot: RoutineSlotItem_routineSlot$key
}

const REORDER_OPERATIONS = {
  'reorder-before': 'available',
  'reorder-after': 'available',
} as const

const DRAG_HANDLE_SELECTOR = '[data-slot-drag-handle]'

const dragDataOf = (listId: string, slotId: string, title: string) => ({
  moveListId: listId,
  slotId,
  title,
})

const draggedSlot = (data: unknown, listId: string): DraggedSlot | null => {
  const { moveListId, slotId, title } = data as Record<string | symbol, unknown>
  if (moveListId !== listId) return null
  if (typeof slotId !== 'string' || typeof title !== 'string') return null
  return { slotId, title }
}

const relationFor = (instruction: Instruction | null): DropRelation | null => {
  if (instruction?.operation === 'reorder-before') return 'before'
  if (instruction?.operation === 'reorder-after') return 'after'
  return null
}

const dropAnchor = (
  dropTargets: readonly DropTargetRecord[],
  listId: string,
): SlotDropAnchor | null => {
  const record = dropTargets[0]
  if (!record) return null
  const anchor = draggedSlot(record.data, listId)
  const relation = relationFor(extractInstruction(record.data))
  if (!anchor || !relation) return null
  return { slotId: anchor.slotId, relation }
}

const canReorderRows = (move: DaySectionMove) =>
  move.slotIds.length > 1 && !move.isMoving

const moveSlotToAnchor = (
  move: DaySectionMove,
  moved: DraggedSlot,
  anchor: SlotDropAnchor,
) => {
  const target = moveTargetForDrop(
    move.slotIds,
    moved.slotId,
    anchor.relation,
    move.slotIds.indexOf(anchor.slotId),
  )
  if (!target) return

  const nextOrder = applyMove(move.slotIds, moved.slotId, target)
  move.moveSlot(moved.slotId, target)
  announceMove({
    title: moved.title,
    movedId: moved.slotId,
    target,
    nextOrder,
  })
}

const commitDrop = (
  context: DragContext,
  source: ElementDragPayload,
  dropTargets: readonly DropTargetRecord[],
) => {
  const { listId, move } = context
  const moved = draggedSlot(source.data, listId)
  const anchor = dropAnchor(dropTargets, listId)
  if (!moved || !anchor) return
  moveSlotToAnchor(move, moved, anchor)
}

interface SortableRoutineSlotRowProps {
  slot: SortableSlot
  connectionId: string
  move: DaySectionMove
  context: RefObject<DragContext>
  canReorder: boolean
  dropIndicator: DropRelation | null
}

const SortableRoutineSlotRow = ({
  slot,
  connectionId,
  move,
  context,
  canReorder,
  dropIndicator,
}: SortableRoutineSlotRowProps) => {
  const rowRef = useRef<HTMLLIElement>(null)
  const { id: slotId, title } = slot

  useEffect(() => {
    const element = rowRef.current
    const dragHandle = element?.querySelector(DRAG_HANDLE_SELECTOR)
    if (!canReorder || !element || !dragHandle) return

    const data = () => dragDataOf(context.current.listId, slotId, title)

    return combine(
      draggable({
        element,
        dragHandle,
        canDrag: () => canReorderRows(context.current.move),
        getInitialData: data,
        onDragStart: ({ source }) => {
          source.element.setAttribute('data-dragging', 'true')
        },
        onDrop: ({ source }) => {
          source.element.removeAttribute('data-dragging')
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          const dragged = draggedSlot(source.data, context.current.listId)
          return (
            canReorderRows(context.current.move) &&
            dragged !== null &&
            dragged.slotId !== slotId
          )
        },
        getData: ({ input, element: target }) =>
          attachInstruction(data(), {
            input,
            element: target,
            axis: 'vertical',
            operations: REORDER_OPERATIONS,
          }),
      }),
    )
  }, [canReorder, context, slotId, title])

  return (
    <li
      ref={rowRef}
      className={styles.row}
      data-slot-id={slotId}
      data-drop-indicator={dropIndicator ?? undefined}
    >
      <RoutineSlotItem
        routineSlot={slot.routineSlot}
        connectionId={connectionId}
        move={move}
      />
    </li>
  )
}

interface SortableRoutineSlotListProps {
  listId: string
  slots: readonly SortableSlot[]
  move: DaySectionMove
}

const SortableRoutineSlotList = ({
  listId,
  slots,
  move,
}: SortableRoutineSlotListProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const context = useRef<DragContext>({ listId, move })
  const [indicator, setIndicator] = useState<SlotDropAnchor | null>(null)

  useEffect(() => {
    context.current = { listId, move }
  }, [listId, move])

  useEffect(
    () =>
      monitorForElements({
        canMonitor: ({ source }) => draggedSlot(source.data, listId) !== null,
        onDropTargetChange: ({ location }) => {
          setIndicator(dropAnchor(location.current.dropTargets, listId))
        },
        onDrop: ({ location, source }) => {
          setIndicator(null)
          commitDrop(context.current, source, location.current.dropTargets)
        },
      }),
    [listId],
  )

  useSlotTouchDrag(listRef, {
    handleSelector: DRAG_HANDLE_SELECTOR,
    canStart: () => canReorderRows(context.current.move),
    onAnchorChange: setIndicator,
    onDrop: (movedSlotId, anchor) => {
      const moved = slots.find(slot => slot.id === movedSlotId)
      if (!moved) return
      moveSlotToAnchor(
        context.current.move,
        { slotId: moved.id, title: moved.title },
        anchor,
      )
    },
  })

  return (
    <ul ref={listRef} className={styles.list} role="list">
      {slots.map(slot => (
        <SortableRoutineSlotRow
          key={slot.id}
          slot={slot}
          connectionId={listId}
          move={move}
          context={context}
          canReorder={slots.length > 1}
          dropIndicator={
            indicator?.slotId === slot.id ? indicator.relation : null
          }
        />
      ))}
    </ul>
  )
}

interface WeeklyPlanRoutineSectionProps {
  weeklyPlanSection: WeeklyPlanRoutineSection_section$key
  dayOfWeek: DayOfWeek
}

export const WeeklyPlanRoutineSection = ({
  weeklyPlanSection: weeklyPlan,
  dayOfWeek,
}: WeeklyPlanRoutineSectionProps) => {
  const routine = useFragment<WeeklyPlanRoutineSection_section$key>(
    graphql`
      fragment WeeklyPlanRoutineSection_section on RoutineSlotConnection {
        __id
        edges {
          node {
            id
            task {
              title
            }
            ...RoutineSlotItem_routineSlot
          }
        }
      }
    `,
    weeklyPlan,
  )

  const slots: SortableSlot[] = routine.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.task.title,
    routineSlot: edge.node,
  }))
  const slotIds = slots.map(slot => slot.id)
  const { moveSlot, isMoving } = useDaySectionMoveTask({
    connectionId: routine.__id,
    slotIds,
    dayOfWeek,
  })

  return (
    <SortableRoutineSlotList
      listId={routine.__id}
      slots={slots}
      move={{ slotIds, moveSlot, isMoving }}
    />
  )
}
