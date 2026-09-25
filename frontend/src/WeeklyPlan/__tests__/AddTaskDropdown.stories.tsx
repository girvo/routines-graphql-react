import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  loadQuery,
  RelayEnvironmentProvider,
  useFragment,
  useLazyLoadQuery,
} from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import {
  ConnectionHandler,
  commitLocalUpdate,
  type OperationDescriptor,
} from 'relay-runtime'

import { AddTaskDropdown } from '../AddTaskDropdown'
import { RoutineSlotItem } from '../RoutineSlotItem'
import { useDaySectionMoveTask } from '../DaySectionMoveTask'
import type { AddTaskDropdownQuery } from '../__generated__/AddTaskDropdownQuery.graphql'
import AddTaskDropdownQueryNode from '../__generated__/AddTaskDropdownQuery.graphql'
import type { AddTaskDropdownStoryQuery } from './__generated__/AddTaskDropdownStoryQuery.graphql'
import type { AddTaskDropdownStory_daySection$key } from './__generated__/AddTaskDropdownStory_daySection.graphql'

const CONTAINER_ID = 'day-section-slots-monday-morning'

const PUSHUPS = {
  id: 'routine-slot-pushups',
  taskId: 'task-pushups',
  title: 'Pushups',
  cursor: 'cursor-pushups',
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

const generateDropdownTasks = (operation: OperationDescriptor) => {
  const dropdownTasks = [
    {
      id: 'task-planks',
      title: 'Planks',
      icon: 'dumbbell',
      cursor: 'cursor-planks',
    },
    {
      id: 'task-running',
      title: 'Running',
      icon: 'run',
      cursor: 'cursor-running',
    },
  ]
  let dropdownEdgeIndex = 0
  let dropdownTaskIndex = 0

  return MockPayloadGenerator.generate(operation, {
    TaskConnection() {
      return {
        edges: [{}, {}],
        pageInfo: { endCursor: 'cursor-running', hasNextPage: false },
      }
    },
    TaskEdge() {
      return {
        cursor: dropdownTasks[dropdownEdgeIndex++].cursor,
      }
    },
    Task() {
      const task = dropdownTasks[dropdownTaskIndex++]
      return {
        id: task.id,
        title: task.title,
        icon: task.icon,
      }
    },
  })
}

const generateDaySectionRead = (operation: OperationDescriptor) =>
  MockPayloadGenerator.generate(operation, {
    DaySectionSlots: () => ({
      id: CONTAINER_ID,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    }),
    RoutineSlotConnection: () => ({
      edges: [{}],
    }),
    RoutineSlotEdge: () => ({ cursor: PUSHUPS.cursor }),
    RoutineSlot: () => ({
      id: PUSHUPS.id,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    }),
    Task: () => ({
      id: PUSHUPS.taskId,
      title: PUSHUPS.title,
      icon: 'dumbbell',
    }),
    PageInfo: () => ({
      endCursor: PUSHUPS.cursor,
      hasNextPage: false,
    }),
  })

const createStoryEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(generateDropdownTasks)
  environment.mock.queuePendingOperation(AddTaskDropdownQueryNode, {})
  const dropdownQueryRef = loadQuery(
    environment,
    AddTaskDropdownQueryNode,
    {},
  ) as PreloadedQuery<AddTaskDropdownQuery>
  seedTaskSlotsConnection(environment, 'task-planks')

  environment.mock.queueOperationResolver(generateDaySectionRead)

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      CreateRoutineSlotPayload() {
        return {}
      },
      RoutineSlotEdge() {
        return {
          cursor: 'cursor-planks-slot',
        }
      },
      RoutineSlot() {
        return {
          id: 'routine-slot-planks',
          dayOfWeek: 'MONDAY',
          section: 'MORNING',
        }
      },
      Task() {
        return {
          id: 'task-planks',
          title: 'Planks',
          icon: 'dumbbell',
        }
      },
    }),
  )

  return { environment, dropdownQueryRef }
}

const AddTaskDropdownStoryInner = ({
  queryRef,
}: {
  queryRef: PreloadedQuery<AddTaskDropdownQuery>
}) => {
  const routineData = useLazyLoadQuery<AddTaskDropdownStoryQuery>(
    graphql`
      query AddTaskDropdownStoryQuery @relay_test_operation {
        daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
          ...AddTaskDropdownStory_daySection
        }
      }
    `,
    {},
  )

  const daySection = useFragment<AddTaskDropdownStory_daySection$key>(
    graphql`
      fragment AddTaskDropdownStory_daySection on DaySectionSlots {
        id
        slots(first: 100) @connection(key: "AddTaskDropdownStory_slots") {
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
    routineData.daySectionSlots,
  )

  const slotIds = daySection.slots.edges.map(edge => edge.node.id)
  const { moveSlot, isMoving } = useDaySectionMoveTask({
    connectionId: daySection.slots.__id,
    slotIds,
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
      <AddTaskDropdown
        queryRef={queryRef}
        dayOfWeek="MONDAY"
        daySection="MORNING"
        connectionId={daySection.slots.__id}
        onButtonHover={() => {}}
        variant="button"
      />
    </div>
  )
}

const AddTaskDropdownStory = () => {
  const [{ environment, dropdownQueryRef }] = useState(createStoryEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <AddTaskDropdownStoryInner queryRef={dropdownQueryRef} />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'WeeklyPlan/AddTaskDropdown',
  component: AddTaskDropdownStory,
  parameters: {},
} satisfies Meta<typeof AddTaskDropdownStory>

export default meta
type Story = StoryObj<typeof meta>

let createReject: ((reason?: Error) => void) | undefined

const createErrorEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(generateDropdownTasks)
  environment.mock.queuePendingOperation(AddTaskDropdownQueryNode, {})
  const dropdownQueryRef = loadQuery(
    environment,
    AddTaskDropdownQueryNode,
    {},
  ) as PreloadedQuery<AddTaskDropdownQuery>
  seedTaskSlotsConnection(environment, 'task-planks')

  environment.mock.queueOperationResolver(generateDaySectionRead)

  environment.mock.queueOperationResolver(
    () =>
      new Promise((_, reject) => {
        createReject = reject
      }) as never,
  )

  return { environment, dropdownQueryRef }
}

const AddTaskWithServerErrorStory = () => {
  const [{ environment, dropdownQueryRef }] = useState(createErrorEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <AddTaskDropdownStoryInner queryRef={dropdownQueryRef} />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      await canvas.findByRole('button', { name: /add task/i }),
    )

    const popover = await screen.findByRole('dialog')
    const plankOption = await within(popover).findByRole('option', {
      name: /planks/i,
    })
    await userEvent.click(plankOption)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(canvas.getAllByText('Planks').length).toBeGreaterThan(0)
    })
  },
}

export const AddTaskWithServerError: Story = {
  render: () => <AddTaskWithServerErrorStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(await canvas.findByText('Pushups')).toBeInTheDocument()
    expect(canvas.queryByText('Planks')).not.toBeInTheDocument()

    await userEvent.click(
      await canvas.findByRole('button', { name: /add task/i }),
    )

    const popover = await screen.findByRole('dialog')
    const planksOption = await within(popover).findByRole('option', {
      name: /planks/i,
    })
    await userEvent.click(planksOption)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(canvas.getAllByText('Planks').length).toBeGreaterThan(0)
    })

    expect(await canvas.findByText('Pushups')).toBeInTheDocument()

    const rejectCreate = createReject
    expect(rejectCreate).toBeDefined()
    rejectCreate?.(new Error('Server error'))
    createReject = undefined

    await waitFor(() => {
      expect(canvas.queryByText('Planks')).not.toBeInTheDocument()
    })
    expect(await canvas.findByText('Pushups')).toBeInTheDocument()
  },
}
