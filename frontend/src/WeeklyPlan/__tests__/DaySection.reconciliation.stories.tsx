import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor, within } from 'storybook/test'

import {
  BOTTOM_ORDER,
  BOTTOM_TITLES,
  chooseMove,
  createEnvironmentWith,
  deferredMoveResolver,
  mockSection,
  moveOperations,
  PLANKS,
  PUSHUPS,
  READ_ORDER,
  readTheServerBack,
  rejectedMoveResolver,
  rejectTheMove,
  settleTheMove,
  SQUATS,
  titlesInOrder,
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
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(PUSHUPS, BOTTOM_ORDER),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    await chooseMove(canvasElement, 'Pushups', 'Move to bottom')

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(BOTTOM_TITLES)
    })
    expect(moveOperations).toHaveLength(1)

    settleTheMove()

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(BOTTOM_TITLES)
    })
  },
}

export const ServerOrderWinsOverTheOptimisticGuess: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(PUSHUPS, [PLANKS, SQUATS, PUSHUPS]),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    await chooseMove(canvasElement, 'Pushups', 'Move down')

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual([
        'Squats',
        'Pushups',
        'Planks',
      ])
    })

    settleTheMove()

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual([
        'Planks',
        'Squats',
        'Pushups',
      ])
    })
  },
}

export const RejectionRollsBackAndToasts: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          rejectedMoveResolver,
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    await chooseMove(canvasElement, 'Pushups', 'Move to bottom')

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(BOTTOM_TITLES)
    })

    rejectTheMove('The move was rejected')

    await readTheServerBack(canvasElement)
    expect(await screen.findByText('The move was rejected')).toBeInTheDocument()
  },
}
