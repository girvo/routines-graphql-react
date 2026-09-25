import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  createMockEnvironment,
  MockPayloadGenerator,
  type MockEnvironment,
} from 'relay-test-utils'
import type { GraphQLResponse, OperationDescriptor } from 'relay-runtime'
import { edgeIndexOf } from '../../relay/__tests__/mock-resolver-path.ts'

type MockSectionName = 'MORNING' | 'MIDDAY'

interface MockSlot {
  id: string
  taskId: string
  title: string
  cursor: string
}

const mockSlots = (label: string, count: number): MockSlot[] =>
  Array.from({ length: count }, (_, index) => {
    const key = `${label.toLowerCase()}-${index + 1}`
    return {
      id: `routine-slot-${key}`,
      taskId: `task-${key}`,
      title: `${label} task ${index + 1}`,
      cursor: `cursor-${key}`,
    }
  })

export const MORNING = mockSlots('Morning', 3)
export const MIDDAY = mockSlots('Midday', 2)

export const reordered = <T>(
  items: readonly T[],
  from: number,
  to: number,
): T[] => {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export const movedToEnd = <T>(items: readonly T[], from: number): T[] =>
  reordered(items, from, items.length - 1)

export const idsOf = (slots: readonly MockSlot[]) => slots.map(slot => slot.id)

interface MockSection {
  containerId: string
  name: MockSectionName
  slots: readonly MockSlot[]
}

export const mockSection = (
  name: MockSectionName,
  slots: readonly MockSlot[],
): MockSection => ({
  containerId: `day-section-slots-monday-${name.toLowerCase()}`,
  name,
  slots,
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
  let active = sections[0]
  const slotAt = (path: readonly string[] | null | undefined) => {
    const index = edgeIndexOf(path)
    return index === null ? undefined : active.slots[index]
  }

  return MockPayloadGenerator.generate(operation, {
    DaySectionSlots: ({ args }) => {
      active =
        sections.find(section => section.name === args?.section) ?? active
      return {
        id: active.containerId,
        dayOfWeek: 'MONDAY',
        section: active.name,
      }
    },
    RoutineSlotConnection: () => ({
      edges: active.slots.map(() => ({})),
    }),
    RoutineSlotEdge: ({ path }) => {
      const slot = slotAt(path)
      return slot && { cursor: slot.cursor }
    },
    RoutineSlot: ({ path }) => {
      const slot = slotAt(path)
      return slot && { id: slot.id, dayOfWeek: 'MONDAY', section: active.name }
    },
    Task: ({ path }) => {
      const slot = slotAt(path)
      return slot && { id: slot.taskId, title: slot.title, icon: 'dumbbell' }
    },
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

const SLOT_ROW = 'li[data-slot-id]'

export const rowsOf = (container: ParentNode) => [
  ...container.querySelectorAll<HTMLLIElement>(SLOT_ROW),
]

export const slotIdsOf = (container: ParentNode) =>
  rowsOf(container).map(row => row.dataset.slotId ?? '')

export const loadedRows = async (container: HTMLElement) => {
  await waitFor(() => {
    expect(rowsOf(container).length).toBeGreaterThan(0)
  })
  return rowsOf(container)
}

export const rowFor = (container: ParentNode, slotId: string) => {
  const row = container.querySelector<HTMLLIElement>(
    `${SLOT_ROW}[data-slot-id="${CSS.escape(slotId)}"]`,
  )
  if (!row) throw new Error(`no row holds slot ${slotId}`)
  return row
}

export const titleOf = (row: Element) => row.textContent ?? ''

export const waitForOrder = (container: ParentNode, slotIds: string[]) =>
  waitFor(() => {
    expect(slotIdsOf(container)).toEqual(slotIds)
  })

export const moveOperationsQueued = () => {
  expect(storyEnvironment).toBeDefined()
  return (storyEnvironment?.mock.getAllOperations() ?? [])
    .map(operation => operation.fragment.node.name)
    .filter(name => name === 'DaySectionMoveTaskMutation')
}

export const moveButtonOf = (row: HTMLElement) =>
  within(row).getByRole('button', { name: /^Move / })

export const openMoveMenu = async (row: HTMLElement) => {
  await userEvent.click(moveButtonOf(row))
  return screen.findByRole('menu')
}

export const commandIn = (menu: HTMLElement, label: MoveLabel) =>
  within(menu).getByRole('menuitem', { name: label })

export const chooseMove = async (row: HTMLElement, command: MoveLabel) => {
  const menu = await openMoveMenu(row)
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
