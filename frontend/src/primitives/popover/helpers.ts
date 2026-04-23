export type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export type Viewport = {
  width: number
  height: number
  scrollX: number
  scrollY: number
}

const GAP = 4
const VIEWPORT_MARGIN = 8

export const resolveSide = (
  initialSide: 'top' | 'bottom',
  trigger: DOMRect,
  contentHeight: number,
  viewportHeight: number,
) => {
  const spaceBelow = viewportHeight - trigger.bottom
  const spaceAbove = trigger.top
  const needed = contentHeight + GAP
  if (initialSide === 'bottom' && spaceBelow < needed && spaceAbove > spaceBelow) return 'top'
  if (initialSide === 'top' && spaceAbove < needed && spaceBelow > spaceAbove) return 'bottom'
  return initialSide
}

export const resolveLeft = (
  align: 'start' | 'end',
  trigger: DOMRect,
  contentWidth: number,
  viewportWidth: number,
) => {
  let left = trigger.left
  if (align === 'end') left = trigger.right - contentWidth
  if (left < VIEWPORT_MARGIN) return VIEWPORT_MARGIN
  if (left + contentWidth > viewportWidth - VIEWPORT_MARGIN) {
    return viewportWidth - VIEWPORT_MARGIN - contentWidth
  }
  return left
}

const getInitialSide = (placement: Placement): 'top' | 'bottom' => {
  if (placement.startsWith('top')) return 'top'
  return 'bottom'
}

const getAlign = (placement: Placement): 'start' | 'end' => {
  if (placement.endsWith('end')) return 'end'
  return 'start'
}

export const computePosition = (
  trigger: DOMRect,
  content: DOMRect,
  placement: Placement,
  viewport: Viewport,
) => {
  const side = resolveSide(getInitialSide(placement), trigger, content.height, viewport.height)
  const left = resolveLeft(getAlign(placement), trigger, content.width, viewport.width)

  let top = trigger.bottom + GAP
  if (side === 'top') top = trigger.top - content.height - GAP

  return { top: top + viewport.scrollY, left: left + viewport.scrollX }
}
