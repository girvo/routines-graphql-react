import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor, within } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  BOTTOM_ORDER,
  BOTTOM_TITLES,
  createEnvironmentWith,
  deferredMoveResolver,
  mockSection,
  moveOperations,
  moveOperationsQueued,
  PUSHUPS,
  READ_ORDER,
  rowHolding,
  settleTheMove,
  TITLES,
  titlesInOrder,
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
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(PUSHUPS, BOTTOM_ORDER),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')
    cleanup()

    const source = rowHolding(canvasElement, 'Pushups')
    const target = rowHolding(canvasElement, 'Planks')

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
      routineSlotId: PUSHUPS.id,
      to: 'BOTTOM',
    })
    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(BOTTOM_TITLES)
    })
    expect(target).not.toHaveAttribute('data-drop-indicator')
    ;(handle as HTMLElement).click()
    await nextFrame()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    settleTheMove()

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          'Pushups moved to the bottom',
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
        createEnvironmentWith([mockSection('MORNING', READ_ORDER)])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    const row = rowHolding(canvasElement, 'Squats')
    const handle = touchPressHandle(row)
    expect(row).toHaveAttribute('data-lifting', 'true')

    touchReleaseHandle(handle)
    expect(row).not.toHaveAttribute('data-lifting')
    ;(handle as HTMLElement).click()
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(titlesInOrder(canvasElement)).toEqual(TITLES)
    expect(moveOperationsQueued()).toEqual([])
  },
}

export const SystemCancelledTouchDragLeavesTheOrderAlone: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([mockSection('MORNING', READ_ORDER)])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    const source = rowHolding(canvasElement, 'Pushups')
    const target = rowHolding(canvasElement, 'Planks')

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
    expect(titlesInOrder(canvasElement)).toEqual(TITLES)
    expect(moveOperationsQueued()).toEqual([])
  },
}

export const MousePressOnTheGripLeavesDraggingToTheNativePath: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([mockSection('MORNING', READ_ORDER)])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    const row = rowHolding(canvasElement, 'Pushups')
    mousePressHandle(row)
    expect(row).not.toHaveAttribute('data-lifting')
  },
}
