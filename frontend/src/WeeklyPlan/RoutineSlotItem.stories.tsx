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
import { ConnectionHandler, commitLocalUpdate } from 'relay-runtime'
import { ToastProvider } from '../toast/ToastProvider'

import { RoutineSlotItem } from './RoutineSlotItem'
import type { RoutineSlotItemStoryQuery } from './__generated__/RoutineSlotItemStoryQuery.graphql'
import type { RoutineSlotItemStory_mondayDay$key } from './__generated__/RoutineSlotItemStory_mondayDay.graphql'

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

const createEnvironment = () => {
  const environment = createMockEnvironment()

  const routineSlots = [
    {
      id: 'routine-slot-pushups',
      title: 'Pushups',
      taskId: 'task-pushups',
      cursor: 'cursor-pushups',
    },
    {
      id: 'routine-slot-squats',
      title: 'Squats',
      taskId: 'task-squats',
      cursor: 'cursor-squats',
    },
  ]
  let routineSlotEdgeIndex = 0
  let routineSlotIndex = 0
  let taskIndex = 0

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
          edges: [{}, {}],
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
        }
      },
      Task() {
        const slot = routineSlots[taskIndex++]
        return {
          id: slot.taskId,
          title: slot.title,
          icon: 'dumbbell',
        }
      },
      PageInfo() {
        return {
          endCursor: 'cursor-squats',
          hasNextPage: false,
        }
      },
    }),
  )

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      DeleteRoutineSlotPayload() {
        return {
          deletedId: 'routine-slot-pushups',
        }
      },
    }),
  )
  seedTaskSlotsConnection(environment, 'task-pushups')

  return environment
}

const RoutineSlotListStoryInner = () => {
  const data = useLazyLoadQuery<RoutineSlotItemStoryQuery>(
    graphql`
      query RoutineSlotItemStoryQuery @relay_test_operation {
        weeklySchedule {
          monday {
            ...RoutineSlotItemStory_mondayDay
          }
        }
      }
    `,
    {},
  )

  const mondayDay = useFragment<RoutineSlotItemStory_mondayDay$key>(
    graphql`
      fragment RoutineSlotItemStory_mondayDay on DaySchedule {
        morning(first: 100) @connection(key: "RoutineSlotItemStory_morning") {
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
    data.weeklySchedule.monday,
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
