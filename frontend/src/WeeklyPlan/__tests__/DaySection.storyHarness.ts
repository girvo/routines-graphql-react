import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  createMockEnvironment,
  MockPayloadGenerator,
  type MockEnvironment,
} from 'relay-test-utils'
import type { GraphQLResponse, OperationDescriptor } from 'relay-runtime'

type MockSectionName = 'MORNING' | 'MIDDAY'

interface MockSlot {
  id: string
  taskId: string
  title: string
  cursor: string
}

export const PUSHUPS: MockSlot = {
  id: 'routine-slot-pushups',
  taskId: 'task-pushups',
  title: 'Pushups',
  cursor: 'cursor-pushups',
}
export const SQUATS: MockSlot = {
  id: 'routine-slot-squats',
  taskId: 'task-squats',
  title: 'Squats',
  cursor: 'cursor-squats',
}
export const PLANKS: MockSlot = {
  id: 'routine-slot-planks',
  taskId: 'task-planks',
  title: 'Planks',
  cursor: 'cursor-planks',
}

export const READ_ORDER: MockSlot[] = [PUSHUPS, SQUATS, PLANKS]
export const BOTTOM_ORDER: MockSlot[] = [SQUATS, PLANKS, PUSHUPS]
export const UP_ORDER: MockSlot[] = [PUSHUPS, PLANKS, SQUATS]
const BURPEES: MockSlot = {
  id: 'routine-slot-burpees',
  taskId: 'task-burpees',
  title: 'Burpees',
  cursor: 'cursor-burpees',
}
const SITUPS: MockSlot = {
  id: 'routine-slot-situps',
  taskId: 'task-situps',
  title: 'Situps',
  cursor: 'cursor-situps',
}

export const MIDDAY_ORDER: MockSlot[] = [BURPEES, SITUPS]

export const TITLES = ['Pushups', 'Squats', 'Planks']
export const BOTTOM_TITLES = ['Squats', 'Planks', 'Pushups']
export const UP_TITLES = ['Pushups', 'Planks', 'Squats']
export const MIDDAY_TITLES = ['Burpees', 'Situps']

interface MockSection {
  containerId: string
  name: MockSectionName
  nodesInGenerationOrder: readonly MockSlot[]
  edgeCount: number
}

export const mockSection = (
  name: MockSectionName,
  nodesInGenerationOrder: readonly MockSlot[],
  edgeCount: number = nodesInGenerationOrder.length,
): MockSection => ({
  containerId: `day-section-slots-monday-${name.toLowerCase()}`,
  name,
  nodesInGenerationOrder,
  edgeCount,
})

export type MoveLabel =
  | 'Move up'
  | 'Move down'
  | 'Move to top'
  | 'Move to bottom'

const generateDaySections = (
  operation: OperationDescriptor,
  sections: readonly MockSection[],
) => {
  const cursors = sections.map(section => ({
    section,
    edge: 0,
    node: 0,
    current: section.nodesInGenerationOrder[0],
  }))
  let active = cursors[0]

  return MockPayloadGenerator.generate(operation, {
    DaySectionSlots: context => {
      const requested = String(context.args?.section ?? '')
      active =
        cursors.find(cursor => cursor.section.name === requested) ?? active
      return {
        id: active.section.containerId,
        dayOfWeek: 'MONDAY',
        section: active.section.name,
      }
    },
    RoutineSlotConnection: () => ({
      edges: Array.from({ length: active.section.edgeCount }, () => ({})),
    }),
    RoutineSlotEdge: () => ({
      cursor: active.section.nodesInGenerationOrder[active.edge++].cursor,
    }),
    RoutineSlot() {
      active.current = active.section.nodesInGenerationOrder[active.node++]
      return {
        id: active.current.id,
        dayOfWeek: 'MONDAY',
        section: active.section.name,
        position: active.node,
      }
    },
    Task: () => ({
      id: active.current.taskId,
      title: active.current.title,
      icon: 'dumbbell',
    }),
    PageInfo: () => ({ endCursor: null, hasNextPage: false }),
  })
}

export const moveOperations: OperationDescriptor[] = []
let storyEnvironment: MockEnvironment | undefined
let settleMove: (() => void) | undefined
let failMove: ((reason?: Error) => void) | undefined

type MoveResolver = (
  operation: OperationDescriptor,
) => GraphQLResponse | Error | null

const readResolver =
  (readSections: readonly MockSection[]): MoveResolver =>
  operation =>
    generateDaySections(operation, readSections)

export const deferredMoveResolver =
  (serverOrder: MockSlot[]): MoveResolver =>
  operation => {
    moveOperations.push(operation)
    return new Promise(resolve => {
      settleMove = () =>
        resolve(
          generateDaySections(operation, [mockSection('MORNING', serverOrder)]),
        )
    }) as never
  }

export const rejectedMoveResolver: MoveResolver = operation => {
  moveOperations.push(operation)
  return new Promise((_, reject) => {
    failMove = reject
  }) as never
}

export const createEnvironmentWith = (
  readSections: readonly MockSection[],
  ...moveResolvers: MoveResolver[]
) => {
  moveOperations.length = 0
  settleMove = undefined
  failMove = undefined

  const environment = createMockEnvironment()
  storyEnvironment = environment
  environment.mock.queueOperationResolver(readResolver(readSections))
  moveResolvers.forEach(resolver =>
    environment.mock.queueOperationResolver(resolver),
  )

  return environment
}

export const titlesInOrder = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getAllByRole('listitem')
    .map(row => row.textContent ?? '')

export const rowHolding = (canvasElement: HTMLElement, title: string) => {
  const row = within(canvasElement).getByText(title).closest('li')
  if (!row) throw new Error(`no list row holds ${title}`)
  return row
}

export const moveOperationsQueued = () => {
  expect(storyEnvironment).toBeDefined()
  return (storyEnvironment?.mock.getAllOperations() ?? [])
    .map(operation => operation.fragment.node.name)
    .filter(name => name === 'DaySectionMoveTaskMutation')
}

export const openMoveMenu = async (
  canvasElement: HTMLElement,
  title: string,
) => {
  const canvas = within(canvasElement)
  await userEvent.click(
    await canvas.findByRole('button', { name: `Move ${title}` }),
  )
  return screen.findByRole('menu')
}

export const commandIn = (menu: HTMLElement, label: MoveLabel) =>
  within(menu).getByRole('menuitem', { name: label })

export const chooseMove = async (
  canvasElement: HTMLElement,
  title: string,
  command: MoveLabel,
) => {
  const menu = await openMoveMenu(canvasElement, title)
  await userEvent.click(
    await within(menu).findByRole('menuitem', { name: command }),
  )
}

export const settleTheMove = () => {
  const settle = settleMove
  expect(settle).toBeDefined()
  settle?.()
  settleMove = undefined
}

export const rejectTheMove = (message: string) => {
  const reject = failMove
  expect(reject).toBeDefined()
  reject?.(new Error(message))
  failMove = undefined
}

export const readTheServerBack = async (canvasElement: HTMLElement) => {
  await waitFor(() => {
    expect(titlesInOrder(canvasElement)).toEqual(TITLES)
  })
}
