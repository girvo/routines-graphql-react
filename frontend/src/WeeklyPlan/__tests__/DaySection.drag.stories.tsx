import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor, within } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  BOTTOM_ORDER,
  BOTTOM_TITLES,
  chooseMove,
  createEnvironmentWith,
  deferredMoveResolver,
  MIDDAY_ORDER,
  MIDDAY_TITLES,
  mockSection,
  moveOperations,
  moveOperationsQueued,
  PLANKS,
  PUSHUPS,
  READ_ORDER,
  readTheServerBack,
  rowHolding,
  settleTheMove,
  SQUATS,
  TITLES,
  titlesInOrder,
  UP_ORDER,
  UP_TITLES,
} from './DaySection.storyHarness'
import {
  DaySectionStoryView,
  DaySectionPairStoryInner,
} from './DaySection.storyView'
import {
  dragHandleOf,
  dropRow,
  endAnyActiveDrag,
  hoverRow,
  liftRow,
  liftRowBody,
  nextFrame,
} from './DaySection.dragSimulation'

const meta = {
  title: 'WeeklyPlan/DaySection/Drag and drop',
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const listHolding = (canvasElement: HTMLElement, title: string) => {
  const list = rowHolding(canvasElement, title).closest('ul')
  if (!list) throw new Error(`no list holds ${title}`)
  return list
}

const titlesInList = (list: Element) =>
  within(list as HTMLElement)
    .getAllByRole('listitem')
    .map(row => row.textContent ?? '')

export const DragDownToTheLastRowMovesToBottom: Story = {
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

    endAnyActiveDrag()
    const source = rowHolding(canvasElement, 'Pushups')
    const target = rowHolding(canvasElement, 'Planks')
    const dataTransfer = new DataTransfer()

    liftRow(source, dataTransfer)
    await nextFrame()
    expect(source).toHaveAttribute('data-dragging', 'true')
    expect(dragHandleOf(source)).toBe(
      canvas.getByRole('button', { name: 'Move Pushups' }),
    )

    hoverRow(target, 'after', dataTransfer)

    await waitFor(() => {
      expect(target).toHaveAttribute('data-drop-indicator', 'after')
    })

    dropRow(target, 'after', dataTransfer)
    expect(source).not.toHaveAttribute('data-dragging')

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

export const DragUpSendsABeforeTarget: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(PLANKS, UP_ORDER),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    endAnyActiveDrag()
    const source = rowHolding(canvasElement, 'Planks')
    const target = rowHolding(canvasElement, 'Squats')
    const dataTransfer = new DataTransfer()

    liftRow(source, dataTransfer)
    hoverRow(target, 'before', dataTransfer)

    await waitFor(() => {
      expect(target).toHaveAttribute('data-drop-indicator', 'before')
    })

    dropRow(target, 'before', dataTransfer)

    await waitFor(() => {
      expect(moveOperations).toHaveLength(1)
    })
    expect(moveOperations[0]?.request.variables.input).toEqual({
      routineSlotId: PLANKS.id,
      beforeRoutineSlotId: SQUATS.id,
    })

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(UP_TITLES)
    })

    settleTheMove()

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(UP_TITLES)
    })

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          'Planks moved to position 2 of 3',
        )
      },
      { timeout: 3000 },
    )
  },
}

export const DragOntoItsOwnRowIsNotADropTarget: Story = {
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

    endAnyActiveDrag()
    const row = rowHolding(canvasElement, 'Pushups')
    const other = rowHolding(canvasElement, 'Planks')
    const dataTransfer = new DataTransfer()

    liftRow(row, dataTransfer)
    hoverRow(other, 'after', dataTransfer)

    await waitFor(() => {
      expect(other).toHaveAttribute('data-drop-indicator', 'after')
    })

    hoverRow(row, 'before', dataTransfer)

    await waitFor(() => {
      expect(other).not.toHaveAttribute('data-drop-indicator')
    })
    expect(row).not.toHaveAttribute('data-drop-indicator')

    dropRow(row, 'before', dataTransfer)

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(TITLES)
    })
    expect(moveOperationsQueued()).toEqual([])
  },
}

export const DragWhileAMoveIsInFlightIsIgnored: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(PUSHUPS, READ_ORDER),
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

    endAnyActiveDrag()
    const source = rowHolding(canvasElement, 'Squats')
    const target = rowHolding(canvasElement, 'Planks')
    const dataTransfer = new DataTransfer()

    liftRow(source, dataTransfer)
    await nextFrame()
    expect(source).not.toHaveAttribute('data-dragging')

    hoverRow(target, 'after', dataTransfer)

    dropRow(target, 'after', dataTransfer)

    expect(moveOperations).toHaveLength(1)

    settleTheMove()

    await readTheServerBack(canvasElement)
  },
}

export const DragFromTheRowBodyIsIgnored: Story = {
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

    endAnyActiveDrag()
    const row = rowHolding(canvasElement, 'Pushups')
    const target = rowHolding(canvasElement, 'Planks')
    const dataTransfer = new DataTransfer()

    liftRowBody(row, dataTransfer)
    await nextFrame()

    expect(row).not.toHaveAttribute('data-dragging')

    hoverRow(target, 'after', dataTransfer)
    dropRow(target, 'after', dataTransfer)

    expect(titlesInOrder(canvasElement)).toEqual(TITLES)
    expect(moveOperations).toHaveLength(0)
  },
}

export const DragFromAnotherSectionIsNotADropTarget: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([
          mockSection('MORNING', READ_ORDER),
          mockSection('MIDDAY', MIDDAY_ORDER),
        ])
      }
      Inner={DaySectionPairStoryInner}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')
    cleanup()

    endAnyActiveDrag()
    const source = rowHolding(canvasElement, 'Pushups')
    const ownTarget = rowHolding(canvasElement, 'Planks')
    const foreignRow = rowHolding(canvasElement, 'Burpees')
    const morningList = listHolding(canvasElement, 'Pushups')
    const middayList = listHolding(canvasElement, 'Burpees')
    const dataTransfer = new DataTransfer()

    liftRow(source, dataTransfer)
    await nextFrame()
    expect(source).toHaveAttribute('data-dragging', 'true')

    expect(hoverRow(ownTarget, 'after', dataTransfer).defaultPrevented).toBe(
      true,
    )
    await waitFor(() => {
      expect(ownTarget).toHaveAttribute('data-drop-indicator', 'after')
    })

    expect(hoverRow(foreignRow, 'before', dataTransfer).defaultPrevented).toBe(
      false,
    )
    await waitFor(() => {
      expect(ownTarget).not.toHaveAttribute('data-drop-indicator')
    })
    expect(foreignRow).not.toHaveAttribute('data-drop-indicator')

    dropRow(foreignRow, 'before', dataTransfer)

    expect(titlesInList(morningList)).toEqual(TITLES)
    expect(titlesInList(middayList)).toEqual(MIDDAY_TITLES)
    expect(moveOperationsQueued()).toEqual([])
  },
}
