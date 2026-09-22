import { announce } from '@atlaskit/pragmatic-drag-and-drop-live-region'
import type { MoveTarget } from './task-order.ts'

interface MoveAnnouncement {
  title: string
  movedId: string
  target: MoveTarget
  nextOrder: readonly string[]
}

export const announceMove = ({
  title,
  movedId,
  target,
  nextOrder,
}: MoveAnnouncement) => {
  const destination =
    'to' in target
      ? target.to === 'TOP'
        ? 'the top'
        : 'the bottom'
      : `position ${nextOrder.indexOf(movedId) + 1} of ${nextOrder.length}`

  announce(`${title} moved to ${destination}`)
}
