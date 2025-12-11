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

const TaskWrapper = () => {
  const environment = createMockEnvironment()
  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op),
  )

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <TaskQuery />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'Tasks/Task',
  component: TaskWrapper,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TaskWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
