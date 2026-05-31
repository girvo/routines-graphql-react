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
import { ConnectionHandler, commitLocalUpdate } from 'relay-runtime'

import { AddTaskDropdown } from './AddTaskDropdown'
import { RoutineSlotItem } from './RoutineSlotItem'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql'
import AddTaskDropdownQueryNode from './__generated__/AddTaskDropdownQuery.graphql'
import type { AddTaskDropdownStoryQuery } from './__generated__/AddTaskDropdownStoryQuery.graphql'
import type { AddTaskDropdownStory_mondayDay$key } from './__generated__/AddTaskDropdownStory_mondayDay.graphql'

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

const createStoryEnvironment = () => {
  const environment = createMockEnvironment()

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

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
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
    }),
  )
  environment.mock.queuePendingOperation(AddTaskDropdownQueryNode, {})
  const dropdownQueryRef = loadQuery(
    environment,
    AddTaskDropdownQueryNode,
    {},
  ) as PreloadedQuery<AddTaskDropdownQuery>
  seedTaskSlotsConnection(environment, 'task-planks')

  const routineSlots = [
    {
      id: 'routine-slot-pushups',
      title: 'Pushups',
      taskId: 'task-pushups',
      cursor: 'cursor-pushups',
    },
  ]
  let routineSlotEdgeIndex = 0
  let routineSlotIndex = 0
  let routineTaskIndex = 0

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      WeeklySchedulePayload() {
        return {}
      },
      DaySchedule() {
        return {
          dayOfWeek: 'MONDAY',
        }
      },
      RoutineSlotConnection() {
        return {
          edges: [{}],
        }
      },
      RoutineSlotEdge() {
        return {
          cursor: routineSlots[routineSlotEdgeIndex++].cursor,
        }
      },
      RoutineSlot() {
        const slot = routineSlots[routineSlotIndex++]
        return {
          id: slot.id,
          dayOfWeek: 'MONDAY',
          section: 'MORNING',
        }
      },
      Task() {
        const slot = routineSlots[routineTaskIndex++]
        return {
          id: slot.taskId,
          title: slot.title,
          icon: 'dumbbell',
        }
      },
      PageInfo() {
        return {
          endCursor: 'cursor-pushups',
          hasNextPage: false,
        }
      },
    }),
  )

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
        weeklySchedule {
          monday {
            ...AddTaskDropdownStory_mondayDay
          }
        }
      }
    `,
    {},
  )

  const mondayDay = useFragment<AddTaskDropdownStory_mondayDay$key>(
    graphql`
      fragment AddTaskDropdownStory_mondayDay on DaySchedule {
        morning(first: 100) @connection(key: "AddTaskDropdownStory_morning") {
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
    routineData.weeklySchedule.monday,
  )

  return (
    <div>
      {mondayDay.morning.edges.map(edge => (
        <RoutineSlotItem
          key={edge.node.id}
          routineSlot={edge.node}
          connectionId={mondayDay.morning.__id}
        />
      ))}
      <AddTaskDropdown
        queryRef={queryRef}
        dayOfWeek="MONDAY"
        daySection="MORNING"
        connectionId={mondayDay.morning.__id}
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
