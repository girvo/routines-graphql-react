import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'

import { TasksList } from './TasksList'
import type { TasksListStoryInnerQuery } from './__generated__/TasksListStoryInnerQuery.graphql'

type TasksListStoryProps = {
  initialIsCreating?: boolean
}

const TASKS_CONNECTION_ID = 'client:tasks:__TaskConnection'

const createEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      TaskConnection() {
        return {
          __id: TASKS_CONNECTION_ID,
          edges: [
            {
              __typename: 'TaskEdge',
              cursor: 'cursor-pushups',
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
          ],
          pageInfo: { endCursor: 'cursor-pushups', hasNextPage: false },
        }
      },
    }),
  )

  environment.mock.queueOperationResolver(() => ({
    data: {
      createTask: {
        taskEdge: {
          __typename: 'TaskEdge',
          cursor: 'cursor-new-task',
          node: {
            __typename: 'Task',
            id: 'task-new',
            title: 'New Task',
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

const TasksListStoryInner = ({
  initialIsCreating = false,
}: TasksListStoryProps) => {
  const [isCreating, setIsCreating] = useState(initialIsCreating)
  const data = useLazyLoadQuery<TasksListStoryInnerQuery>(
    graphql`
      query TasksListStoryInnerQuery @relay_test_operation {
        ...TasksList_tasks
      }
    `,
    {},
  )

  return (
    <TasksList
      tasks={data}
      isCreating={isCreating}
      setIsCreating={setIsCreating}
      searchQuery=""
    />
  )
}

const TasksListStory = ({ initialIsCreating = false }: TasksListStoryProps) => {
  const [environment] = useState(createEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <TasksListStoryInner initialIsCreating={initialIsCreating} />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'Tasks/TasksList',
  component: TasksListStory,
  args: {
    initialIsCreating: false,
  },
} satisfies Meta<typeof TasksListStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText('Pushups')).toBeInTheDocument()
  },
}

export const WithCreateForm: Story = {
  args: { initialIsCreating: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textbox = await canvas.findByRole('textbox', { name: /task name/i })

    await userEvent.type(textbox, 'New Task')
    await userEvent.click(canvas.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(
        canvas.queryByRole('textbox', { name: /task name/i }),
      ).not.toBeInTheDocument()
    })
    expect((await canvas.findAllByText('New Task')).length).toBeGreaterThan(0)
  },
}
