import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  useLazyLoadQuery,
  RelayEnvironmentProvider,
  graphql,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'

import { Task } from './Task'
import { ToastProvider } from '../toast/ToastProvider'
import type { TaskQuery } from './__generated__/TaskQuery.graphql'

const TASK_ID = 'task-pushups'
const TASK_CONNECTION_ID = 'client:TaskQuery_tasks:__TaskConnection'

const TaskQuery = () => {
  const data = useLazyLoadQuery<TaskQuery>(
    graphql`
      query TaskQuery @relay_test_operation {
        tasks(first: 1) @connection(key: "TaskQuery_tasks") {
          __id
          edges {
            node {
              ...Task_task
              ...EditTask_task
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

  if (!data.tasks?.edges?.[0]?.node) return null

  return (
    <Task
      task={data.tasks.edges[0].node}
      updatable={data.tasks.edges[0].node}
      connectionId={data.tasks.__id}
    />
  )
}

const TaskStory = () => {
  const [environment] = useState(() => {
    const env = createMockEnvironment()

    env.mock.queueOperationResolver(op =>
      MockPayloadGenerator.generate(op, {
        TaskConnection() {
          return {
            __id: TASK_CONNECTION_ID,
            edges: [{}],
          }
        },
        TaskEdge() {
          return {
            cursor: 'cursor-pushups',
          }
        },
        Task() {
          return {
            id: TASK_ID,
            title: 'Pushups',
            icon: 'dumbbell',
            createdAt: '2026-01-01T00:00:00.000Z',
          }
        },
        RoutineSlotConnection() {
          return {
            edges: [],
          }
        },
        PageInfo() {
          return {
            endCursor: null,
            hasNextPage: false,
          }
        },
      }),
    )

    env.mock.queueOperationResolver(op =>
      MockPayloadGenerator.generate(op, {
        DeleteTaskPayload() {
          return {
            deletedId: TASK_ID,
          }
        },
      }),
    )

    return env
  })

  return (
    <div className="max-w-200">
      <RelayEnvironmentProvider environment={environment}>
        <ToastProvider>
          <Suspense fallback="Loading...">
            <TaskQuery />
          </Suspense>
        </ToastProvider>
      </RelayEnvironmentProvider>
    </div>
  )
}

const meta = {
  title: 'Tasks/Task',
  component: TaskStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TaskStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.findByText('Pushups')).resolves.toBeInTheDocument()
  },
}

export const DeleteTask: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('renders the task', async () => {
      expect(await canvas.findByText('Pushups')).toBeInTheDocument()
    })

    await step('opens the delete confirmation dialog', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /delete task/i }))
      expect(await screen.findByRole('heading', { name: /delete task/i })).toBeInTheDocument()
    })

    await step('confirms deletion', async () => {
      await userEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    })

    await step('task is removed from the DOM', async () => {
      await waitFor(() => {
        expect(screen.queryByText('Pushups')).not.toBeInTheDocument()
      })
    })
  },
}
