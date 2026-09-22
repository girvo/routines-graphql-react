import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import {
  createMockEnvironment,
  MockPayloadGenerator,
  type MockEnvironment,
} from 'relay-test-utils'
import type { GraphQLResponse, OperationDescriptor } from 'relay-runtime'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import { DaySection } from './DaySection'
import { ToastProvider } from '../toast/ToastProvider'
import type { DaySectionStoryQuery } from './__generated__/DaySectionStoryQuery.graphql'

const CONTAINER_ID = 'day-section-slots-monday-morning'

interface MockSlot {
  id: string
  taskId: string
  title: string
  cursor: string
}

const PUSHUPS: MockSlot = {
  id: 'routine-slot-pushups',
  taskId: 'task-pushups',
  title: 'Pushups',
  cursor: 'cursor-pushups',
}
const SQUATS: MockSlot = {
  id: 'routine-slot-squats',
  taskId: 'task-squats',
  title: 'Squats',
  cursor: 'cursor-squats',
}
const PLANKS: MockSlot = {
  id: 'routine-slot-planks',
  taskId: 'task-planks',
  title: 'Planks',
  cursor: 'cursor-planks',
}

const READ_ORDER: MockSlot[] = [PUSHUPS, SQUATS, PLANKS]
const BOTTOM_ORDER: MockSlot[] = [SQUATS, PLANKS, PUSHUPS]
const UP_ORDER: MockSlot[] = [PUSHUPS, PLANKS, SQUATS]
const TITLES = ['Pushups', 'Squats', 'Planks']
const BOTTOM_TITLES = ['Squats', 'Planks', 'Pushups']
const UP_TITLES = ['Pushups', 'Planks', 'Squats']

type MoveLabel = 'Move up' | 'Move down' | 'Move to top' | 'Move to bottom'

type DragEdge = 'before' | 'after'

const generateDaySection = (
  operation: OperationDescriptor,
  nodesInGenerationOrder: MockSlot[],
  edgeCount: number,
) => {
  let edgeIndex = 0
  let nodeIndex = 0
  let currentNode = nodesInGenerationOrder[0]

  return MockPayloadGenerator.generate(operation, {
    DaySectionSlots: () => ({
      id: CONTAINER_ID,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    }),
    RoutineSlotConnection: () => ({
      edges: Array.from({ length: edgeCount }, () => ({})),
    }),
    RoutineSlotEdge: () => ({
      cursor: nodesInGenerationOrder[edgeIndex++].cursor,
    }),
    RoutineSlot() {
      currentNode = nodesInGenerationOrder[nodeIndex++]
      return {
        id: currentNode.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
        position: nodeIndex,
      }
    },
    Task: () => ({
      id: currentNode.taskId,
      title: currentNode.title,
      icon: 'dumbbell',
    }),
    PageInfo: () => ({ endCursor: null, hasNextPage: false }),
  })
}

let moveOperations: OperationDescriptor[] = []
let storyEnvironment: MockEnvironment | undefined
let settleMove: (() => void) | undefined
let failMove: ((reason?: Error) => void) | undefined

type MoveResolver = (
  operation: OperationDescriptor,
) => GraphQLResponse | Error | null

const readResolver =
  (nodesInReadOrder: MockSlot[]): MoveResolver =>
  operation =>
    generateDaySection(operation, nodesInReadOrder, nodesInReadOrder.length)

const deferredMoveResolver =
  (moved: MockSlot, serverOrder: MockSlot[]): MoveResolver =>
  operation => {
    moveOperations.push(operation)
    return new Promise(resolve => {
      settleMove = () =>
        resolve(
          generateDaySection(
            operation,
            [moved, ...serverOrder],
            serverOrder.length,
          ),
        )
    }) as never
  }

const rejectedMoveResolver: MoveResolver = operation => {
  moveOperations.push(operation)
  return new Promise((_, reject) => {
    failMove = reject
  }) as never
}

const createEnvironmentWith = (
  readNodes: MockSlot[],
  ...moveResolvers: MoveResolver[]
) => {
  moveOperations = []
  settleMove = undefined
  failMove = undefined

  const environment = createMockEnvironment()
  storyEnvironment = environment
  environment.mock.queueOperationResolver(readResolver(readNodes))
  moveResolvers.forEach(resolver =>
    environment.mock.queueOperationResolver(resolver),
  )

  return environment
}

const ensureToastRoot = () => {
  if (!document.getElementById('toast-root')) {
    document.body.appendChild(document.createElement('div')).id = 'toast-root'
  }
}

const DaySectionStoryInner = () => {
  const data = useLazyLoadQuery<DaySectionStoryQuery>(
    graphql`
      query DaySectionStoryQuery @relay_test_operation {
        daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
          ...DaySection_section
        }
      }
    `,
    {},
  )

  return (
    <DaySection
      label="Morning"
      section={data.daySectionSlots}
      dayOfWeek="MONDAY"
      daySection="MORNING"
      queryRef={null}
      onButtonHover={() => {}}
    />
  )
}

const DaySectionStoryView = ({
  createReadAndMoves,
}: {
  createReadAndMoves: () => MockEnvironment
}) => {
  const [{ environment }] = useState(() => ({
    environment: createReadAndMoves(),
  }))
  ensureToastRoot()

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ToastProvider>
        <Suspense fallback="Loading...">
          <DaySectionStoryInner />
        </Suspense>
      </ToastProvider>
    </RelayEnvironmentProvider>
  )
}

const createDefaultEnvironment = () =>
  createEnvironmentWith(READ_ORDER, deferredMoveResolver(PUSHUPS, BOTTOM_ORDER))

const DaySectionStory = () => (
  <DaySectionStoryView createReadAndMoves={createDefaultEnvironment} />
)

const createOptimisticEnvironment = () =>
  createEnvironmentWith(READ_ORDER, deferredMoveResolver(PUSHUPS, BOTTOM_ORDER))

const createServerWinsEnvironment = () =>
  createEnvironmentWith(
    READ_ORDER,
    deferredMoveResolver(PUSHUPS, [PLANKS, SQUATS, PUSHUPS]),
  )

const createRejectionEnvironment = () =>
  createEnvironmentWith(READ_ORDER, rejectedMoveResolver)

const createCommandsEnvironment = () =>
  createEnvironmentWith(
    READ_ORDER,
    deferredMoveResolver(SQUATS, READ_ORDER),
    deferredMoveResolver(SQUATS, READ_ORDER),
    deferredMoveResolver(PUSHUPS, READ_ORDER),
    deferredMoveResolver(PLANKS, READ_ORDER),
  )

const createAnnouncementEnvironment = () =>
  createEnvironmentWith(
    READ_ORDER,
    deferredMoveResolver(PUSHUPS, [SQUATS, PUSHUPS, PLANKS]),
  )

const createSingleSlotEnvironment = () => createEnvironmentWith([SQUATS])

const createInFlightEnvironment = () =>
  createEnvironmentWith(READ_ORDER, deferredMoveResolver(PUSHUPS, READ_ORDER))

const createDragDownEnvironment = () =>
  createEnvironmentWith(READ_ORDER, deferredMoveResolver(PUSHUPS, BOTTOM_ORDER))

const createDragUpEnvironment = () =>
  createEnvironmentWith(READ_ORDER, deferredMoveResolver(PLANKS, UP_ORDER))

const createDropOnItselfEnvironment = () => createEnvironmentWith(READ_ORDER)

const meta = {
  title: 'WeeklyPlan/DaySection',
  component: DaySectionStory,
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof DaySectionStory>

export default meta
type Story = StoryObj<typeof meta>

const titlesInOrder = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getAllByRole('listitem')
    .map(row => row.textContent ?? '')

const rowHolding = (canvasElement: HTMLElement, title: string) => {
  const row = within(canvasElement).getByText(title).closest('li')
  if (!row) throw new Error(`no list row holds ${title}`)
  return row
}

const dragHandleOf = (row: Element) => {
  const handle = row.querySelector('[data-slot-drag-handle]')
  if (!handle) throw new Error('the row has no drag handle')
  return handle
}

const pointOf = (element: Element, heightRatio: number) => {
  const box = element.getBoundingClientRect()
  return {
    clientX: box.left + box.width / 2,
    clientY: box.top + box.height * heightRatio,
  }
}

const nextFrame = () =>
  new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve())
  })

const dispatchDrag = (
  type: 'dragstart' | 'dragover' | 'drop',
  target: Element,
  point: { clientX: number; clientY: number },
  dataTransfer: DataTransfer,
) => {
  target.dispatchEvent(
    new DragEvent(type, {
      bubbles: true,
      cancelable: true,
      dataTransfer,
      ...point,
    }),
  )
}

const liftRow = (row: Element, dataTransfer: DataTransfer) => {
  dispatchDrag('dragstart', row, pointOf(dragHandleOf(row), 0.5), dataTransfer)
}

const liftRowBody = (row: Element, dataTransfer: DataTransfer) => {
  dispatchDrag('dragstart', row, pointOf(row, 0.5), dataTransfer)
}

const edgePoint = (row: Element, edge: DragEdge) =>
  pointOf(row, edge === 'before' ? 0.25 : 0.75)

const hoverRow = (row: Element, edge: DragEdge, dataTransfer: DataTransfer) => {
  dispatchDrag('dragover', row, edgePoint(row, edge), dataTransfer)
}

const dropRow = (row: Element, edge: DragEdge, dataTransfer: DataTransfer) => {
  dispatchDrag('drop', row, edgePoint(row, edge), dataTransfer)
}

const endAnyActiveDrag = () => {
  document.dispatchEvent(new DragEvent('dragend', { bubbles: true }))
}

const moveOperationsQueued = () => {
  expect(storyEnvironment).toBeDefined()
  return (storyEnvironment?.mock.getAllOperations() ?? [])
    .map(operation => operation.fragment.node.name)
    .filter(name => name === 'DaySectionMoveTaskMutation')
}

const openMoveMenu = async (canvasElement: HTMLElement, title: string) => {
  const canvas = within(canvasElement)
  await userEvent.click(
    await canvas.findByRole('button', { name: `Move ${title}` }),
  )
  return screen.findByRole('menu')
}

const chooseMove = async (
  canvasElement: HTMLElement,
  title: string,
  command: MoveLabel,
) => {
  const menu = await openMoveMenu(canvasElement, title)
  await userEvent.click(
    await within(menu).findByRole('menuitem', { name: command }),
  )
}

const settleTheMove = () => {
  const settle = settleMove
  expect(settle).toBeDefined()
  settle?.()
  settleMove = undefined
}

const rejectTheMove = (message: string) => {
  const reject = failMove
  expect(reject).toBeDefined()
  reject?.(new Error(message))
  failMove = undefined
}

const readTheServerBack = async (canvasElement: HTMLElement) => {
  await waitFor(() => {
    expect(titlesInOrder(canvasElement)).toEqual(TITLES)
  })
}

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

export const OptimisticReorderSurvivesSettlement: Story = {
  render: () => (
    <DaySectionStoryView createReadAndMoves={createOptimisticEnvironment} />
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
    <DaySectionStoryView createReadAndMoves={createServerWinsEnvironment} />
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
    <DaySectionStoryView createReadAndMoves={createRejectionEnvironment} />
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

export const CommandsSendRelativeTargets: Story = {
  render: () => (
    <DaySectionStoryView createReadAndMoves={createCommandsEnvironment} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    await chooseMove(canvasElement, 'Squats', 'Move up')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(1)
    })
    expect(moveOperations[0]?.request.variables.input).toEqual({
      routineSlotId: SQUATS.id,
      to: 'TOP',
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    await chooseMove(canvasElement, 'Squats', 'Move down')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(2)
    })
    expect(moveOperations[1]?.request.variables.input).toEqual({
      routineSlotId: SQUATS.id,
      to: 'BOTTOM',
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    await chooseMove(canvasElement, 'Pushups', 'Move down')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(3)
    })
    expect(moveOperations[2]?.request.variables.input).toEqual({
      routineSlotId: PUSHUPS.id,
      afterRoutineSlotId: SQUATS.id,
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    await chooseMove(canvasElement, 'Planks', 'Move up')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(4)
    })
    expect(moveOperations[3]?.request.variables.input).toEqual({
      routineSlotId: PLANKS.id,
      beforeRoutineSlotId: SQUATS.id,
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    const menu = await openMoveMenu(canvasElement, 'Pushups')
    const alreadyFirst = within(menu).getByRole('menuitem', {
      name: 'Move up',
    })
    expect(alreadyFirst).toBeDisabled()
    await userEvent.click(alreadyFirst)
    expect(moveOperations).toHaveLength(4)
  },
}

export const ScreenReaderHearsTheNewPosition: Story = {
  render: () => (
    <DaySectionStoryView createReadAndMoves={createAnnouncementEnvironment} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')
    cleanup()

    await openMoveMenu(canvasElement, 'Pushups')
    const menu = await screen.findByRole('menu')
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map(item => item.textContent),
    ).toEqual(['Move up', 'Move down', 'Move to top', 'Move to bottom'])
    expect(
      within(menu).getByRole('menuitem', { name: 'Move down' }),
    ).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    expect(
      within(menu).getByRole('menuitem', { name: 'Move to bottom' }),
    ).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'Move Pushups' })).toHaveFocus()

    await chooseMove(canvasElement, 'Pushups', 'Move down')

    expect(canvas.getByRole('button', { name: 'Move Pushups' })).toHaveFocus()

    settleTheMove()

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          'Pushups moved to position 2 of 3',
        )
      },
      { timeout: 3000 },
    )
  },
}

export const SingleTaskSectionOffersNoMoveControl: Story = {
  render: () => (
    <DaySectionStoryView createReadAndMoves={createSingleSlotEnvironment} />
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

export const SecondMoveIsNotOfferedWhileOneIsInFlight: Story = {
  render: () => (
    <DaySectionStoryView createReadAndMoves={createInFlightEnvironment} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    await chooseMove(canvasElement, 'Pushups', 'Move to bottom')

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(BOTTOM_TITLES)
    })

    const menu = await openMoveMenu(canvasElement, 'Squats')
    const items = await within(menu).findAllByRole('menuitem')
    items.forEach(item => expect(item).toBeDisabled())

    settleTheMove()

    await readTheServerBack(canvasElement)
    expect(moveOperations).toHaveLength(1)
  },
}

export const DragDownToTheLastRowMovesToBottom: Story = {
  render: () => (
    <DaySectionStoryView createReadAndMoves={createDragDownEnvironment} />
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
    <DaySectionStoryView createReadAndMoves={createDragUpEnvironment} />
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
    <DaySectionStoryView createReadAndMoves={createDropOnItselfEnvironment} />
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
    expect(moveOperations).toHaveLength(0)
  },
}

export const DragWhileAMoveIsInFlightIsIgnored: Story = {
  render: () => (
    <DaySectionStoryView createReadAndMoves={createInFlightEnvironment} />
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
    <DaySectionStoryView createReadAndMoves={createDragDownEnvironment} />
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
    expect(moveOperationsQueued()).toEqual([])
  },
}
