import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import type { OperationDescriptor } from 'relay-runtime'

import { TodaySection } from '../TodaySection.tsx'
import type { TodaySectionStoryQuery } from './__generated__/TodaySectionStoryQuery.graphql.ts'

interface MockInstance {
  id: string
  slotId: string
  taskId: string
  title: string
}

const SQUATS: MockInstance = {
  id: 'daily-task-instance-squats',
  slotId: 'routine-slot-squats',
  taskId: 'task-squats',
  title: 'Squats',
}
const PLANKS: MockInstance = {
  id: 'daily-task-instance-planks',
  slotId: 'routine-slot-planks',
  taskId: 'task-planks',
  title: 'Planks',
}
const PUSHUPS: MockInstance = {
  id: 'daily-task-instance-pushups',
  slotId: 'routine-slot-pushups',
  taskId: 'task-pushups',
  title: 'Pushups',
}

const CONNECTION_ORDER: MockInstance[] = [SQUATS, PLANKS, PUSHUPS]
const TITLES = ['Squats', 'Planks', 'Pushups']

const createEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver((operation: OperationDescriptor) => {
    let index = 0
    let currentNode = CONNECTION_ORDER[0]

    return MockPayloadGenerator.generate(operation, {
      DailyTaskInstanceConnection: () => ({
        edges: CONNECTION_ORDER.map(() => ({})),
      }),
      DailyTaskInstance() {
        currentNode = CONNECTION_ORDER[index++]
        return {
          id: currentNode.id,
          completion: null,
        }
      },
      RoutineSlot: () => ({ id: currentNode.slotId }),
      Task: () => ({
        id: currentNode.taskId,
        title: currentNode.title,
        icon: 'dumbbell',
      }),
    })
  })

  return environment
}

const TodaySectionStoryInner = () => {
  const data = useLazyLoadQuery<TodaySectionStoryQuery>(
    graphql`
      query TodaySectionStoryQuery @relay_test_operation {
        dailyRoutine {
          morning(first: 100) {
            ...TodaySection_section
          }
        }
      }
    `,
    {},
  )

  return <TodaySection label="Morning" section={data.dailyRoutine.morning} />
}

const TodaySectionStory = () => {
  const [environment] = useState(createEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <TodaySectionStoryInner />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'Today/TodaySection',
  component: TodaySectionStory,
  parameters: {},
} satisfies Meta<typeof TodaySectionStory>

export default meta
type Story = StoryObj<typeof meta>

export const RowsFollowTheConnectionsOrder: Story = {
  render: () => <TodaySectionStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(
      await canvas.findByRole('checkbox', { name: /squats/i }),
    ).toBeInTheDocument()

    const rows = canvas.getAllByRole('checkbox')
    expect(rows).toHaveLength(TITLES.length)
    rows.forEach((row, index) => {
      expect(row).toHaveAccessibleName(TITLES[index])
    })
    expect(canvasElement.querySelector('[data-slot-drag-handle]')).toBeNull()
    expect(canvas.queryAllByRole('button', { name: /^Move / })).toEqual([])
  },
}
