import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor, within } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  BOTTOM_ORDER,
  BOTTOM_TITLES,
  chooseMove,
  createEnvironmentWith,
  deferredMoveResolver,
  mockSection,
  PUSHUPS,
  READ_ORDER,
  settleTheMove,
  SQUATS,
  TITLES,
  titlesInOrder,
} from './DaySection.storyHarness'
import { DaySectionStoryView } from './DaySection.storyView'

const DaySectionStory = () => (
  <DaySectionStoryView
    createReadAndMoves={() =>
      createEnvironmentWith(
        [mockSection('MORNING', READ_ORDER)],
        deferredMoveResolver(PUSHUPS, BOTTOM_ORDER),
      )
    }
  />
)

const meta = {
  title: 'WeeklyPlan/DaySection/Basics',
  component: DaySectionStory,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof DaySectionStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <DaySectionStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await canvas.findByText('Pushups')
    expect(titlesInOrder(canvasElement)).toEqual(TITLES)
    cleanup()

    await chooseMove(canvasElement, 'Pushups', 'Move to bottom')
    settleTheMove()

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(BOTTOM_TITLES)
    })

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

export const SingleTaskSectionOffersNoMoveControl: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([mockSection('MORNING', [SQUATS])])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(await canvas.findByText('Squats')).toBeInTheDocument()
    expect(canvas.getAllByText('Squats')).toHaveLength(1)
    expect(canvasElement.querySelector('[data-slot-drag-handle]')).toBeNull()
    expect(
      canvas.queryByRole('button', { name: 'Move Squats' }),
    ).not.toBeInTheDocument()
    expect(canvas.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  },
}
