import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { ToastProvider } from '../toast/ToastProvider'

import { CreateTask } from './CreateTask'
import type { CreateTaskStoryQuery } from './__generated__/CreateTaskStoryQuery.graphql'

const TASKS_CONNECTION_ID = 'client:tasks:__TaskConnection'

const createEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      TaskConnection() {
        return {
          __id: TASKS_CONNECTION_ID,
          edges: [],
          pageInfo: { endCursor: null, hasNextPage: false },
        }
      },
    }),
  )

  environment.mock.queueOperationResolver(() => ({
    data: {
      createTask: {
        taskEdge: {
          cursor: 'cursor-new-task',
          node: {
            __typename: 'Task',
            id: 'task-pushups',
            title: 'Pushups',
            icon: 'dumbbell',
            createdAt: '2026-01-01T00:00:00.000Z',
            slots: {
              edges: [],
              pageInfo: { endCursor: null, hasNextPage: false },
            },
          },
        },
      },
    },
  }))

  return environment
}

const CreateTaskStoryInner = () => {
  const [isCreating, setIsCreating] = useState(true)
  const data = useLazyLoadQuery<CreateTaskStoryQuery>(
    graphql`
      query CreateTaskStoryQuery @relay_test_operation {
        tasks(first: 20) @connection(key: "CreateTaskStory_tasks") {
          __id
          edges {
            cursor
            node {
              id
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
    {},
  )

  return (
    <div className="max-w-200">
      <ToastProvider>
        {isCreating ? (
          <CreateTask
            connectionId={data.tasks.__id}
            setIsCreating={setIsCreating}
          />
        ) : (
          <div role="status">Task created</div>
        )}
      </ToastProvider>
    </div>
  )
}

const CreateTaskStory = () => {
  const [environment] = useState(createEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <CreateTaskStoryInner />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'Tasks/CreateTask',
  component: CreateTaskStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CreateTaskStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textbox = await canvas.findByRole('textbox', { name: /task name/i })

    await userEvent.type(textbox, 'Pushups')
    await userEvent.click(canvas.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(
        canvas.queryByRole('textbox', { name: /task name/i }),
      ).not.toBeInTheDocument()
    })
    expect(canvas.getByRole('status')).toHaveTextContent('Task created')
  },
}
