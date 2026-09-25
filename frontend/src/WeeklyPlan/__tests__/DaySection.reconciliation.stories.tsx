import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen } from 'storybook/test'

import {
  chooseMove,
  createEnvironmentWith,
  deferredMoveResolver,
  idsOf,
  loadedRows,
  mockSection,
  MORNING,
  moveOperations,
  movedToEnd,
  rejectedMoveResolver,
  rejectTheMove,
  reordered,
  settleTheMove,
  slotIdsOf,
  waitForOrder,
} from './DaySection.storyHarness'
import { DaySectionStoryView } from './DaySection.storyView'

const meta = {
  title: 'WeeklyPlan/DaySection/Server reconciliation',
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OptimisticReorderSurvivesSettlement: Story = {
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
    const [first] = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)

    await chooseMove(first, 'Move to bottom')

    await waitForOrder(canvasElement, movedToEnd(before, 0))
    expect(moveOperations).toHaveLength(1)

    settleTheMove()

    await waitForOrder(canvasElement, movedToEnd(before, 0))
  },
}

const SERVER_DISAGREES = reordered(MORNING, MORNING.length - 1, 0)

export const ServerOrderWinsOverTheOptimisticGuess: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(SERVER_DISAGREES),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [first] = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)
    const optimistic = reordered(before, 0, 1)
    expect(optimistic).not.toEqual(idsOf(SERVER_DISAGREES))

    await chooseMove(first, 'Move down')

    await waitForOrder(canvasElement, optimistic)

    settleTheMove()

    await waitForOrder(canvasElement, idsOf(SERVER_DISAGREES))
  },
}

export const RejectionRollsBackAndToasts: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', MORNING)],
          rejectedMoveResolver,
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [first] = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)

    await chooseMove(first, 'Move to bottom')

    await waitForOrder(canvasElement, movedToEnd(before, 0))

    rejectTheMove('The move was rejected')

    await waitForOrder(canvasElement, before)
    expect(await screen.findByText('The move was rejected')).toBeInTheDocument()
  },
}
