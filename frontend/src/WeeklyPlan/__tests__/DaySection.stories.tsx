import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor, within } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  chooseMove,
  createEnvironmentWith,
  deferredMoveResolver,
  idsOf,
  loadedRows,
  mockSection,
  MORNING,
  movedToEnd,
  settleTheMove,
  slotIdsOf,
  titleOf,
  waitForOrder,
} from './DaySection.storyHarness'
import { DaySectionStoryView } from './DaySection.storyView'

const DaySectionStory = () => (
  <DaySectionStoryView
    createReadAndMoves={() =>
      createEnvironmentWith(
        [mockSection('MORNING', MORNING)],
        deferredMoveResolver(movedToEnd(MORNING, 0)),
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
    const [first] = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)
    expect(before).toEqual(idsOf(MORNING))
    cleanup()

    await chooseMove(first, 'Move to bottom')
    settleTheMove()

    await waitForOrder(canvasElement, movedToEnd(before, 0))

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          `${titleOf(first)} moved to the bottom`,
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
        createEnvironmentWith([mockSection('MORNING', MORNING.slice(0, 1))])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const rows = await loadedRows(canvasElement)
    expect(rows).toHaveLength(1)

    const [only] = rows
    expect(only.querySelector('[data-slot-drag-handle]')).toBeNull()
    expect(
      within(only).queryByRole('button', { name: /^Move / }),
    ).not.toBeInTheDocument()
    expect(
      within(only).getByRole('button', { name: /remove/i }),
    ).toBeInTheDocument()
  },
}
