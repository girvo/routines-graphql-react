export type DragEdge = 'before' | 'after'

export const dragHandleOf = (row: Element) => {
  const handle = row.querySelector('[data-slot-drag-handle]')
  if (!handle) throw new Error('the row has no drag handle')
  return handle
}

const pointOf = (element: Element, heightRatio: number) => {
  const box = element.getBoundingClientRect()
  return {
    clientX: box.left + box.width / 2,
    clientY: box.top + box.height * heightRatio,
  }
}

export const nextFrame = () =>
  new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve())
  })

const dispatchDrag = (
  type: 'dragstart' | 'dragover' | 'drop',
  target: Element,
  point: { clientX: number; clientY: number },
  dataTransfer: DataTransfer,
) => {
  const event = new DragEvent(type, {
    bubbles: true,
    cancelable: true,
    dataTransfer,
    ...point,
  })
  target.dispatchEvent(event)
  return event
}

export const liftRow = (row: Element, dataTransfer: DataTransfer) => {
  dispatchDrag('dragstart', row, pointOf(dragHandleOf(row), 0.5), dataTransfer)
}

export const liftRowBody = (row: Element, dataTransfer: DataTransfer) => {
  dispatchDrag('dragstart', row, pointOf(row, 0.5), dataTransfer)
}

const edgePoint = (row: Element, edge: DragEdge) =>
  pointOf(row, edge === 'before' ? 0.25 : 0.75)

export const hoverRow = (
  row: Element,
  edge: DragEdge,
  dataTransfer: DataTransfer,
) => dispatchDrag('dragover', row, edgePoint(row, edge), dataTransfer)

export const dropRow = (
  row: Element,
  edge: DragEdge,
  dataTransfer: DataTransfer,
) => {
  dispatchDrag('drop', row, edgePoint(row, edge), dataTransfer)
}

export const endAnyActiveDrag = () => {
  document.dispatchEvent(new DragEvent('dragend', { bubbles: true }))
}

const TOUCH_POINTER_ID = 11

const dispatchPointer = (
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  target: Element,
  point: { clientX: number; clientY: number },
  pointerType: 'touch' | 'mouse' = 'touch',
) => {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId: TOUCH_POINTER_ID,
      pointerType,
      isPrimary: true,
      ...point,
    }),
  )
}

export const touchPressHandle = (row: Element) => {
  const handle = dragHandleOf(row)
  dispatchPointer('pointerdown', handle, pointOf(handle, 0.5))
  return handle
}

export const mousePressHandle = (row: Element) => {
  const handle = dragHandleOf(row)
  dispatchPointer('pointerdown', handle, pointOf(handle, 0.5), 'mouse')
  return handle
}

export const touchMoveHandleTo = (
  handle: Element,
  row: Element,
  edge: DragEdge,
) => {
  dispatchPointer('pointermove', handle, edgePoint(row, edge))
}

export const touchReleaseHandle = (handle: Element) => {
  dispatchPointer('pointerup', handle, pointOf(handle, 0.5))
}

export const touchCancelHandle = (handle: Element) => {
  dispatchPointer('pointercancel', handle, pointOf(handle, 0.5))
}
