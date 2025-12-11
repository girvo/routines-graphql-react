import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  useLazyLoadQuery,
  RelayEnvironmentProvider,
  graphql,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'

import { Task } from '../../Tasks/Task'
import { Suspense } from 'react'
import type { TaskQuery } from './__generated__/TaskQuery.graphql'

const TaskQuery = () => {
  const data = useLazyLoadQuery<TaskQuery>(
    graphql`
      query TaskQuery @relay_test_operation {
        node(id: "") {
          ... on Task {
            ...TaskDisplay
          }
        }
      }
    `,
    {},
  )

  if (!data.node) return null

  return <Task task={data.node} />
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
          <ul className="list bg-base-200 rounded-box shadow-md">
            <TaskQuery />
          </ul>
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

export const Default: Story = {}
