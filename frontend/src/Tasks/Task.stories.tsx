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
const ORIGINAL_TASK_TITLE = 'Pushups'
const UPDATED_TASK_TITLE = 'Diamond Pushups'

const waitForNextTick = () =>
  new Promise(resolve => {
    setTimeout(resolve, 0)
  })

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
            title: ORIGINAL_TASK_TITLE,
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
    await expect(
      canvas.findByText(ORIGINAL_TASK_TITLE),
    ).resolves.toBeInTheDocument()
  },
}

export const DeleteTask: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('renders the task', async () => {
      expect(await canvas.findByText(ORIGINAL_TASK_TITLE)).toBeInTheDocument()
    })

    await step('opens the delete confirmation dialog', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: /delete task/i }),
      )
      expect(
        await screen.findByRole('heading', { name: /delete task/i }),
      ).toBeInTheDocument()
    })

    await step('confirms deletion', async () => {
      await userEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    })

    await step('task is removed from the DOM', async () => {
      await waitFor(() => {
        expect(screen.queryByText(ORIGINAL_TASK_TITLE)).not.toBeInTheDocument()
      })
    })
  },
}

const EditTaskStory = ({ serverError = false }: { serverError?: boolean }) => {
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
            title: ORIGINAL_TASK_TITLE,
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

    if (serverError) {
      env.mock.queueOperationResolver(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Update failed')), 0)
          }) as never,
      )
    } else {
      env.mock.queueOperationResolver(op =>
        MockPayloadGenerator.generate(op, {
          UpdateTaskPayload() {
            return {}
          },
          Task() {
            return {
              id: TASK_ID,
              title: UPDATED_TASK_TITLE,
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
    }

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

const editTaskTitle = async (
  canvas: ReturnType<typeof within>,
  title: string,
) => {
  const titleInput = await canvas.findByRole('textbox', { name: /task name/i })
  expect(titleInput).toHaveValue(ORIGINAL_TASK_TITLE)
  await userEvent.clear(titleInput)
  await userEvent.type(titleInput, title)
}

export const EditTask: Story = {
  render: () => <EditTaskStory />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('renders the task', async () => {
      expect(await canvas.findByText(ORIGINAL_TASK_TITLE)).toBeInTheDocument()
    })

    await step('opens the edit form', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /edit task/i }))
    })

    await step('updates the task name', async () => {
      await editTaskTitle(canvas, UPDATED_TASK_TITLE)
    })

    await step('saves the updated task', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /save/i }))
    })

    await step('asserts updated task name after mutation settles', async () => {
      await waitFor(() => {
        expect(canvas.queryByText(ORIGINAL_TASK_TITLE)).not.toBeInTheDocument()
      })
      expect(await canvas.findByText(UPDATED_TASK_TITLE)).toBeInTheDocument()

      await waitForNextTick()

      expect(canvas.getByText(UPDATED_TASK_TITLE)).toBeInTheDocument()
      expect(canvas.queryByText(ORIGINAL_TASK_TITLE)).not.toBeInTheDocument()
    })
  },
}

export const EditTaskWithServerError: Story = {
  render: () => <EditTaskStory serverError />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('renders the task', async () => {
      expect(await canvas.findByText(ORIGINAL_TASK_TITLE)).toBeInTheDocument()
    })

    await step('opens the edit form', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /edit task/i }))
    })

    await step('updates and saves the task name', async () => {
      await editTaskTitle(canvas, UPDATED_TASK_TITLE)
      await userEvent.click(canvas.getByRole('button', { name: /save/i }))
    })

    await step('rolls back optimistic title after mutation error', async () => {
      await waitForNextTick()

      expect(await canvas.findByText(ORIGINAL_TASK_TITLE)).toBeInTheDocument()
      expect(canvas.queryByText(UPDATED_TASK_TITLE)).not.toBeInTheDocument()
    })
  },
}
