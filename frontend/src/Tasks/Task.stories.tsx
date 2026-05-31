import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  useLazyLoadQuery,
  RelayEnvironmentProvider,
  graphql,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { within, expect } from 'storybook/test'

import { Task } from './Task'
import { Suspense } from 'react'
import type { TaskQuery } from './__generated__/TaskQuery.graphql'

const TaskQuery = () => {
  const data = useLazyLoadQuery<TaskQuery>(
    graphql`
      query TaskQuery @relay_test_operation {
        node(id: "test_id") {
          ... on Task {
            __typename
            ...Task_task
            ...EditTask_task
          }
        }
      }
    `,
    {},
  )

  if (!data.node) return null
  if (data.node?.__typename !== 'Task') return null

  return <Task connectionId="" task={data.node} updatable={data.node} />
}

const renderer = () => {
  const environment = createMockEnvironment()
  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      Task() {
        return {
          title: 'my awesome title',
        }
      },
      RoutineSlotConnection() {
        return {
          edges: [],
        }
      },
    }),
  )

  return (
    <div className="max-w-200">
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback="Loading...">
          <TaskQuery />
        </Suspense>
      </RelayEnvironmentProvider>
    </div>
  )
}

const meta = {
  title: 'Tasks/Task',
  component: renderer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof renderer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.findByText('my awesome title')).resolves.toBeDefined()
  },
}
