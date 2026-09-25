import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  chooseMove,
  createEnvironmentWith,
  deferredMoveResolver,
  loadedRows,
  mockSection,
  MIDDAY,
  MORNING,
  moveButtonOf,
  moveOperations,
  moveOperationsQueued,
  movedToEnd,
  reordered,
  rowsOf,
  settleTheMove,
  slotIdsOf,
  titleOf,
  waitForOrder,
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

const slotListsIn = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('ul')].filter(
    list => rowsOf(list).length > 0,
  )

export const DragDownToTheLastRowMovesToBottom: Story = {
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

    endAnyActiveDrag()
    const dataTransfer = new DataTransfer()

    liftRow(source, dataTransfer)
    await nextFrame()
    expect(source).toHaveAttribute('data-dragging', 'true')
    expect(dragHandleOf(source)).toBe(moveButtonOf(source))

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
      routineSlotId: before[0],
      to: 'BOTTOM',
    })

    await waitForOrder(canvasElement, movedToEnd(before, 0))
    expect(target).not.toHaveAttribute('data-drop-indicator')

    settleTheMove()

    await waitForOrder(canvasElement, movedToEnd(before, 0))

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

export const DragUpSendsABeforeTarget: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(reordered(MORNING, 2, 1)),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const rows = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)
    const source = rows[2]
    const target = rows[1]

    endAnyActiveDrag()
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
      routineSlotId: before[2],
      beforeRoutineSlotId: before[1],
    })

    await waitForOrder(canvasElement, reordered(before, 2, 1))

    settleTheMove()

    await waitForOrder(canvasElement, reordered(before, 2, 1))

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          `${titleOf(source)} moved to position 2 of ${before.length}`,
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
        createEnvironmentWith([mockSection('MORNING', MORNING)])
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const rows = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)
    const row = rows[0]
    const other = rows[rows.length - 1]

    endAnyActiveDrag()
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

    await waitForOrder(canvasElement, before)
    expect(moveOperationsQueued()).toEqual([])
  },
}

export const DragWhileAMoveIsInFlightIsIgnored: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(MORNING),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [first, source, target] = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)

    await chooseMove(first, 'Move to bottom')

    await waitForOrder(canvasElement, movedToEnd(before, 0))

    endAnyActiveDrag()
    const dataTransfer = new DataTransfer()

    liftRow(source, dataTransfer)
    await nextFrame()
    expect(source).not.toHaveAttribute('data-dragging')

    hoverRow(target, 'after', dataTransfer)

    dropRow(target, 'after', dataTransfer)

    expect(moveOperations).toHaveLength(1)

    settleTheMove()

    await waitForOrder(canvasElement, before)
  },
}

export const DragFromTheRowBodyIsIgnored: Story = {
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
    const row = rows[0]
    const target = rows[rows.length - 1]

    endAnyActiveDrag()
    const dataTransfer = new DataTransfer()

    liftRowBody(row, dataTransfer)
    await nextFrame()

    expect(row).not.toHaveAttribute('data-dragging')

    hoverRow(target, 'after', dataTransfer)
    dropRow(target, 'after', dataTransfer)

    expect(slotIdsOf(canvasElement)).toEqual(before)
    expect(moveOperations).toHaveLength(0)
  },
}

export const DragFromAnotherSectionIsNotADropTarget: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith([
          mockSection('MORNING', MORNING),
          mockSection('MIDDAY', MIDDAY),
        ])
      }
      Inner={DaySectionPairStoryInner}
    />
  ),
  play: async ({ canvasElement }) => {
    await loadedRows(canvasElement)
    await waitFor(() => {
      expect(slotListsIn(canvasElement)).toHaveLength(2)
    })
    const [ownList, foreignList] = slotListsIn(canvasElement)
    const ownBefore = slotIdsOf(ownList)
    const foreignBefore = slotIdsOf(foreignList)
    const ownRows = rowsOf(ownList)
    const source = ownRows[0]
    const ownTarget = ownRows[ownRows.length - 1]
    const [foreignRow] = rowsOf(foreignList)
    cleanup()

    endAnyActiveDrag()
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

    expect(slotIdsOf(ownList)).toEqual(ownBefore)
    expect(slotIdsOf(foreignList)).toEqual(foreignBefore)
    expect(moveOperationsQueued()).toEqual([])
  },
}
