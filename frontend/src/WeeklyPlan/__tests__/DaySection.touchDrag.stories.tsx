import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  createEnvironmentWith,
  deferredMoveResolver,
  loadedRows,
  mockSection,
  MORNING,
  moveOperations,
  moveOperationsQueued,
  movedToEnd,
  settleTheMove,
  slotIdsOf,
  titleOf,
  waitForOrder,
} from './DaySection.storyHarness'
import { DaySectionStoryView } from './DaySection.storyView'
import {
  mousePressHandle,
  nextFrame,
  touchCancelHandle,
  touchMoveHandleTo,
  touchPressHandle,
  touchReleaseHandle,
} from './DaySection.dragSimulation'

const meta = {
  title: 'WeeklyPlan/DaySection/Touch drag',
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TouchDragFromTheGripMovesWithoutALongPress: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(movedToEnd(MORNING, 0)),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const rows = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)
    const source = rows[0]
    const target = rows[rows.length - 1]
    cleanup()

    const handle = touchPressHandle(source)
    expect(source).toHaveAttribute('data-lifting', 'true')
    expect(source).not.toHaveAttribute('data-touch-dragging')

    touchMoveHandleTo(handle, target, 'after')
    expect(source).toHaveAttribute('data-touch-dragging', 'true')
    await waitFor(() => {
      expect(target).toHaveAttribute('data-drop-indicator', 'after')
    })

    touchReleaseHandle(handle)
    expect(source).not.toHaveAttribute('data-lifting')
    expect(source).not.toHaveAttribute('data-touch-dragging')
    expect(source.style.transform).toBe('')

    await waitFor(() => {
      expect(moveOperations).toHaveLength(1)
    })
    expect(moveOperations[0]?.request.variables.input).toEqual({
      routineSlotId: before[0],
      to: 'BOTTOM',
    })
    await waitForOrder(canvasElement, movedToEnd(before, 0))
    expect(target).not.toHaveAttribute('data-drop-indicator')
    ;(handle as HTMLElement).click()
    await nextFrame()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    settleTheMove()

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          `${titleOf(source)} moved to the bottom`,
        )
      },
      { timeout: 3000 },
    )
  },
}

export const TouchPressWithoutMovingStillOpensTheMoveMenu: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([mockSection('MORNING', MORNING)])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [, row] = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)
    const handle = touchPressHandle(row)
    expect(row).toHaveAttribute('data-lifting', 'true')

    touchReleaseHandle(handle)
    expect(row).not.toHaveAttribute('data-lifting')
    ;(handle as HTMLElement).click()
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(slotIdsOf(canvasElement)).toEqual(before)
    expect(moveOperationsQueued()).toEqual([])
  },
}

export const SystemCancelledTouchDragLeavesTheOrderAlone: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([mockSection('MORNING', MORNING)])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const rows = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)
    const source = rows[0]
    const target = rows[rows.length - 1]

    const handle = touchPressHandle(source)
    touchMoveHandleTo(handle, target, 'after')
    await waitFor(() => {
      expect(target).toHaveAttribute('data-drop-indicator', 'after')
    })

    touchCancelHandle(handle)

    await waitFor(() => {
      expect(target).not.toHaveAttribute('data-drop-indicator')
    })
    expect(source).not.toHaveAttribute('data-lifting')
    expect(source).not.toHaveAttribute('data-touch-dragging')
    expect(source.style.transform).toBe('')
    expect(slotIdsOf(canvasElement)).toEqual(before)
    expect(moveOperationsQueued()).toEqual([])
  },
}

export const MousePressOnTheGripLeavesDraggingToTheNativePath: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([mockSection('MORNING', MORNING)])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [row] = await loadedRows(canvasElement)
    mousePressHandle(row)
    expect(row).not.toHaveAttribute('data-lifting')
  },
}
