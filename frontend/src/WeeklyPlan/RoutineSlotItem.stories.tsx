import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useFragment,
  useLazyLoadQuery,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import {
  ConnectionHandler,
  commitLocalUpdate,
  type OperationDescriptor,
} from 'relay-runtime'
import { ToastProvider } from '../toast/ToastProvider'

import { RoutineSlotItem } from './RoutineSlotItem'
import { useDaySectionMoveTask } from './DaySectionMoveTask'
import type { RoutineSlotItemStoryQuery } from './__generated__/RoutineSlotItemStoryQuery.graphql'
import type { RoutineSlotItemStory_daySection$key } from './__generated__/RoutineSlotItemStory_daySection.graphql'

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
const READ_SLOTS: MockSlot[] = [PUSHUPS, SQUATS]

const generateDaySectionRead = (operation: OperationDescriptor) => {
  let edgeIndex = 0
  let slotIndex = 0
  let currentSlot = READ_SLOTS[0]

  return MockPayloadGenerator.generate(operation, {
    DaySectionSlots: () => ({
      id: CONTAINER_ID,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    }),
    RoutineSlotConnection: () => ({
      edges: READ_SLOTS.map(() => ({})),
    }),
    RoutineSlotEdge: () => ({ cursor: READ_SLOTS[edgeIndex++].cursor }),
    RoutineSlot() {
      currentSlot = READ_SLOTS[slotIndex++]
      return {
        id: currentSlot.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      }
    },
    Task: () => ({
      id: currentSlot.taskId,
      title: currentSlot.title,
      icon: 'dumbbell',
    }),
    PageInfo: () => ({
      endCursor: READ_SLOTS[READ_SLOTS.length - 1].cursor,
      hasNextPage: false,
    }),
  })
}

const seedTaskSlotsConnection = (
  environment: ReturnType<typeof createMockEnvironment>,
  taskId: string,
) => {
  commitLocalUpdate(environment, store => {
    const connectionId = ConnectionHandler.getConnectionID(taskId, 'Task_slots')
    const connection =
      store.get(connectionId) ??
      store.create(connectionId, 'RoutineSlotConnection')
    const pageInfo =
      connection.getLinkedRecord('pageInfo') ??
      store.create(`${connectionId}:pageInfo`, 'PageInfo')

    pageInfo.setValue(null, 'endCursor')
    pageInfo.setValue(false, 'hasNextPage')
    connection.setValue(0, '__connection_next_edge_index')
    connection.setLinkedRecords([], 'edges')
    connection.setLinkedRecord(pageInfo, 'pageInfo')
  })
}

let deleteReject: ((reason?: Error) => void) | undefined

const createEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(generateDaySectionRead)
  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      DeleteRoutineSlotPayload() {
        return {
          deletedId: PUSHUPS.id,
        }
      },
    }),
  )
  seedTaskSlotsConnection(environment, PUSHUPS.taskId)

  return environment
}

const RoutineSlotListStoryInner = () => {
  const data = useLazyLoadQuery<RoutineSlotItemStoryQuery>(
    graphql`
      query RoutineSlotItemStoryQuery @relay_test_operation {
        daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
          ...RoutineSlotItemStory_daySection
        }
      }
    `,
    {},
  )

  const daySection = useFragment<RoutineSlotItemStory_daySection$key>(
    graphql`
      fragment RoutineSlotItemStory_daySection on DaySectionSlots {
        id
        slots(first: 100) @connection(key: "RoutineSlotItemStory_slots") {
          __id
          edges {
            cursor
            node {
              id
              ...RoutineSlotItem_routineSlot
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
    data.daySectionSlots,
  )

  const slotIds = daySection.slots.edges.map(edge => edge.node.id)
  const { moveSlot, isMoving } = useDaySectionMoveTask({
    connectionId: daySection.slots.__id,
    slotIds,
    dayOfWeek: 'MONDAY',
  })

  return (
    <div>
      {daySection.slots.edges.map(edge => (
        <RoutineSlotItem
          key={edge.node.id}
          routineSlot={edge.node}
          connectionId={daySection.slots.__id}
          move={{ slotIds, moveSlot, isMoving }}
        />
      ))}
    </div>
  )
}

const RoutineSlotListStory = () => {
  const [environment] = useState(createEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <ToastProvider>
          <RoutineSlotListStoryInner />
        </ToastProvider>
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const createDeleteErrorEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(generateDaySectionRead)
  seedTaskSlotsConnection(environment, PUSHUPS.taskId)
  environment.mock.queueOperationResolver(
    () =>
      new Promise((_, reject) => {
        deleteReject = reject
      }) as never,
  )

  return environment
}

const DeleteWithServerErrorStory = () => {
  const [environment] = useState(createDeleteErrorEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <ToastProvider>
          <RoutineSlotListStoryInner />
        </ToastProvider>
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'Components/RoutineSlotItem',
  component: RoutineSlotListStory,
  parameters: {},
} satisfies Meta<typeof RoutineSlotListStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(await canvas.findByText('Pushups')).toBeInTheDocument()
    const removeButtons = await canvas.findAllByRole('button', {
      name: /remove/i,
    })
    await userEvent.click(removeButtons[0])

    const dialog = await screen.findByRole('dialog')
    const dialogWithin = within(dialog)
    expect(
      await dialogWithin.findByRole('heading', { name: /are you sure/i }),
    ).toBeInTheDocument()
    expect(
      await dialogWithin.findByText(/remove "pushups"/i),
    ).toBeInTheDocument()

    await userEvent.click(
      dialogWithin.getByRole('button', { name: /confirm/i }),
    )

    await waitFor(() => {
      expect(canvas.queryByText('Pushups')).not.toBeInTheDocument()
    })
    expect(canvas.getByText('Squats')).toBeInTheDocument()
  },
}

export const DeleteWithServerError: Story = {
  render: () => <DeleteWithServerErrorStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(await canvas.findByText('Pushups')).toBeInTheDocument()
    expect(canvas.getByText('Squats')).toBeInTheDocument()

    const removeButtons = await canvas.findAllByRole('button', {
      name: /remove/i,
    })
    await userEvent.click(removeButtons[0])

    const dialog = await screen.findByRole('dialog')
    const dialogWithin = within(dialog)
    expect(
      await dialogWithin.findByRole('heading', { name: /are you sure/i }),
    ).toBeInTheDocument()
    expect(
      await dialogWithin.findByText(/remove "pushups"/i),
    ).toBeInTheDocument()
    await userEvent.click(
      dialogWithin.getByRole('button', { name: /confirm/i }),
    )

    await waitFor(() => {
      expect(canvas.queryByText('Pushups')).not.toBeInTheDocument()
    })
    expect(canvas.getByText('Squats')).toBeInTheDocument()

    const rejectDelete = deleteReject
    expect(rejectDelete).toBeDefined()
    rejectDelete?.(new Error('Server error'))
    deleteReject = undefined

    await waitFor(() => {
      expect(canvas.getByText('Pushups')).toBeInTheDocument()
    })
    expect(canvas.getByText('Squats')).toBeInTheDocument()
  },
}
