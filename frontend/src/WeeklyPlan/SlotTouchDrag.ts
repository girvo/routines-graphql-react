import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { DropRelation } from './task-order.ts'

export interface SlotDropAnchor {
  slotId: string
  relation: DropRelation
}

interface SlotTouchDragOptions {
  handleSelector: string
  canStart: () => boolean
  onAnchorChange: (anchor: SlotDropAnchor | null) => void
  onDrop: (movedSlotId: string, anchor: SlotDropAnchor) => void
}

const DRAG_THRESHOLD_PX = 8
const CLICK_AFTER_DRAG_WINDOW_MS = 400
const SLOT_ROW_SELECTOR = '[data-slot-id]'

const sameAnchor = (a: SlotDropAnchor | null, b: SlotDropAnchor | null) =>
  a?.slotId === b?.slotId && a?.relation === b?.relation

const anchorUnder = (
  list: HTMLElement,
  dragged: HTMLElement,
  x: number,
  y: number,
): SlotDropAnchor | null => {
  for (const element of document.elementsFromPoint(x, y)) {
    const row = element.closest<HTMLElement>(SLOT_ROW_SELECTOR)
    if (!row || row === dragged || !list.contains(row)) continue
    const slotId = row.dataset.slotId
    if (!slotId) continue
    const box = row.getBoundingClientRect()
    return {
      slotId,
      relation: y < box.top + box.height / 2 ? 'before' : 'after',
    }
  }
  return null
}

const ignoreTheClickThatEndsADrag = () => {
  const swallow = (event: MouseEvent) => event.preventDefault()
  window.addEventListener('click', swallow, { capture: true, once: true })
  window.setTimeout(
    () => window.removeEventListener('click', swallow, { capture: true }),
    CLICK_AFTER_DRAG_WINDOW_MS,
  )
}

export const useSlotTouchDrag = (
  listRef: RefObject<HTMLElement | null>,
  options: SlotTouchDragOptions,
) => {
  const latest = useRef(options)

  useEffect(() => {
    latest.current = options
  })

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    let abandonActiveDrag: (() => void) | null = null

    const onPointerDown = (down: PointerEvent) => {
      if (down.pointerType === 'mouse' || !down.isPrimary) return
      if (!(down.target instanceof Element)) return
      const handle = down.target.closest(latest.current.handleSelector)
      const row = handle?.closest<HTMLElement>(SLOT_ROW_SELECTOR)
      const movedSlotId = row?.dataset.slotId
      if (!row || !movedSlotId || !list.contains(row)) return
      if (!latest.current.canStart()) return

      let dragging = false
      let anchor: SlotDropAnchor | null = null
      row.setAttribute('data-lifting', 'true')

      const onMove = (move: PointerEvent) => {
        if (move.pointerId !== down.pointerId) return
        const dx = move.clientX - down.clientX
        const dy = move.clientY - down.clientY
        if (!dragging) {
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
          dragging = true
          row.setAttribute('data-touch-dragging', 'true')
        }
        row.style.transform = `translateY(${dy}px)`
        const next = anchorUnder(list, row, move.clientX, move.clientY)
        if (sameAnchor(next, anchor)) return
        anchor = next
        latest.current.onAnchorChange(next)
      }

      const finish = (commit: boolean) => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointercancel', onCancel)
        abandonActiveDrag = null
        row.removeAttribute('data-lifting')
        row.removeAttribute('data-touch-dragging')
        row.style.removeProperty('transform')
        if (!dragging) return
        latest.current.onAnchorChange(null)
        ignoreTheClickThatEndsADrag()
        if (commit && anchor) latest.current.onDrop(movedSlotId, anchor)
      }

      const onUp = (up: PointerEvent) => {
        if (up.pointerId === down.pointerId) finish(true)
      }

      const onCancel = (cancel: PointerEvent) => {
        if (cancel.pointerId === down.pointerId) finish(false)
      }

      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
      document.addEventListener('pointercancel', onCancel)
      abandonActiveDrag = () => finish(false)
    }

    list.addEventListener('pointerdown', onPointerDown)
    return () => {
      list.removeEventListener('pointerdown', onPointerDown)
      abandonActiveDrag?.()
    }
  }, [listRef])
}
