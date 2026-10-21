import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useCallback, useState, type ReactNode } from 'react'
import {
  PageHeaderContext,
  type PageHeaderSlots,
} from '../../utils/page-header.ts'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import { commitMutation, type OperationDescriptor } from 'relay-runtime'
import {
  createMockEnvironment,
  MockPayloadGenerator,
  type MockEnvironment,
} from 'relay-test-utils'
import { ToastProvider } from '../../toast/ToastProvider'
import { invalidateStoreOnSuccess } from '../../relay/invalidate-store.ts'
import CreateTaskMutation, {
  type CreateTaskMutation as CreateTaskMutationType,
} from '../__generated__/CreateTaskMutation.graphql.ts'

import { TasksList } from '../TasksList'
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
          id: 'task-pushups',
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

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      CreateTaskPayload() {
        return {}
      },
      TaskEdge() {
        return {
          cursor: 'cursor-new-task',
        }
      },
      Task() {
        const title =
          typeof op.request.variables.title === 'string'
            ? op.request.variables.title
            : 'New Task'

        return {
          id: 'task-new',
          title,
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
    />
  )
}

const TasksListStory = ({ initialIsCreating = false }: TasksListStoryProps) => {
  const [environment] = useState(createEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ToastProvider>
        <Suspense fallback="Loading...">
          <TasksListStoryInner initialIsCreating={initialIsCreating} />
        </Suspense>
      </ToastProvider>
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

const createRollbackEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      TaskConnection() {
        return {
          __id: TASKS_CONNECTION_ID,
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
          id: 'task-pushups',
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

  environment.mock.queueOperationResolver(
    () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Network error')), 50)
      }) as never,
  )

  return environment
}

const CreateTaskRollbackStory = () => {
  const [environment] = useState(createRollbackEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ToastProvider>
        <Suspense fallback="Loading...">
          <TasksListStoryInner initialIsCreating={true} />
        </Suspense>
      </ToastProvider>
    </RelayEnvironmentProvider>
  )
}

const searchResolvers = (op: OperationDescriptor) => {
  const titleSearch = op.request.variables.titleSearch
  return {
    TaskConnection() {
      const matched = titleSearch == null || titleSearch === 'Walk'
      return {
        __id: TASKS_CONNECTION_ID,
        edges: matched ? [{}] : [],
      }
    },
    Task() {
      return titleSearch === 'Walk'
        ? {
            id: 'task-walk',
            title: 'Walk in the park',
            icon: 'shoe',
            createdAt: '2026-01-01T00:00:00.000Z',
          }
        : {
            id: 'task-pushups',
            title: 'Pushups',
            icon: 'dumbbell',
            createdAt: '2026-01-01T00:00:00.000Z',
          }
    },
    TaskEdge() {
      return { cursor: 'cursor-search' }
    },
    RoutineSlotConnection() {
      return { edges: [] }
    },
    PageInfo() {
      return { endCursor: null, hasNextPage: false }
    },
  }
}

const storyHarness: { environment: MockEnvironment | undefined } = {
  environment: undefined,
}

const storyEnvironment = () => {
  const environment = storyHarness.environment
  if (!environment) throw new Error('story harness missing')
  return environment
}

const pendingOperationsNamed = (environment: MockEnvironment, name: string) =>
  environment.mock
    .getAllOperations()
    .filter(op => op.request.node.operation.name === name)

const resolveOperations = (environment: MockEnvironment, name: string) => {
  for (const op of pendingOperationsNamed(environment, name)) {
    environment.mock.resolve(
      op,
      MockPayloadGenerator.generate(op, searchResolvers(op)),
    )
  }
}

const drainSearchOperations = async (
  environment: MockEnvironment,
): Promise<Array<string | null | undefined>> => {
  await waitFor(
    () =>
      expect(
        pendingOperationsNamed(environment, 'TasksListPaginationQuery').length,
      ).toBeGreaterThan(0),
    { timeout: 3000 },
  )
  const ops = pendingOperationsNamed(environment, 'TasksListPaginationQuery')
  const titles = ops.map(
    op => op.request.variables.titleSearch as string | null | undefined,
  )
  for (const op of ops) {
    environment.mock.resolve(
      op,
      MockPayloadGenerator.generate(op, searchResolvers(op)),
    )
  }
  return titles
}

const emptySlots: PageHeaderSlots = {
  title: null,
  subtitle: null,
  actions: null,
  belowHeader: null,
}

const PageHeaderHarness = ({ children }: { children: ReactNode }) => {
  const [slots, setSlotsState] = useState<PageHeaderSlots>(emptySlots)
  const setSlots = useCallback(
    (next: Partial<PageHeaderSlots>) =>
      setSlotsState(prev => ({ ...prev, ...next })),
    [],
  )
  const clearSlots = useCallback(
    (keys: Array<keyof PageHeaderSlots>) =>
      setSlotsState(prev => {
        const next = { ...prev }
        for (const key of keys) next[key] = null
        return next
      }),
    [],
  )

  return (
    <PageHeaderContext value={{ ...slots, setSlots, clearSlots }}>
      <div>{slots.actions}</div>
      <div>{slots.belowHeader}</div>
      {children}
    </PageHeaderContext>
  )
}

const SearchRaceStory = ({
  environment,
  initialIsCreating = false,
}: {
  environment: MockEnvironment
  initialIsCreating?: boolean
}) => (
  <RelayEnvironmentProvider environment={environment}>
    <ToastProvider>
      <PageHeaderHarness>
        <Suspense fallback="Loading...">
          <TasksListStoryInner initialIsCreating={initialIsCreating} />
        </Suspense>
      </PageHeaderHarness>
    </ToastProvider>
  </RelayEnvironmentProvider>
)

const renderSearchRaceStory = (args: { initialIsCreating?: boolean }) => {
  storyHarness.environment = createMockEnvironment()
  return (
    <SearchRaceStory
      environment={storyHarness.environment}
      initialIsCreating={args.initialIsCreating}
    />
  )
}

const firstSearchInput = async (canvas: ReturnType<typeof within>) => {
  await waitFor(() =>
    expect(
      canvas.getAllByPlaceholderText(/search tasks/i).length,
    ).toBeGreaterThan(0),
  )
  return canvas.getAllByPlaceholderText(/search tasks/i)[0]
}

export const CreateWhileSearchingRefetchesCurrentSearch: Story = {
  args: { initialIsCreating: true },
  render: args => renderSearchRaceStory(args),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const environment = storyEnvironment()
    const titles: Array<string | null | undefined> = []

    await waitFor(
      () =>
        expect(
          pendingOperationsNamed(environment, 'TasksListStoryInnerQuery')
            .length,
        ).toBeGreaterThan(0),
      { timeout: 3000 },
    )
    resolveOperations(environment, 'TasksListStoryInnerQuery')
    await canvas.findByText('Pushups')

    const search = await firstSearchInput(canvas)
    await userEvent.type(search, 'Milk')
    titles.push(...(await drainSearchOperations(environment)))
    expect(titles).toEqual(['Milk'])

    const textbox = await canvas.findByRole('textbox', { name: /task name/i })
    await userEvent.type(textbox, 'New Task')
    await userEvent.click(canvas.getByRole('button', { name: /save/i }))

    await waitFor(
      () =>
        expect(
          pendingOperationsNamed(environment, 'CreateTaskMutation'),
        ).toEqual([expect.anything()]),
      { timeout: 3000 },
    )

    await userEvent.clear(search)
    await userEvent.type(search, 'Walk')
    titles.push(...(await drainSearchOperations(environment)))
    expect(titles).toEqual(['Milk', 'Walk'])

    resolveOperations(environment, 'CreateTaskMutation')

    titles.push(...(await drainSearchOperations(environment)))
    expect(titles).toEqual(['Milk', 'Walk', 'Walk'])
  },
}

export const SearchStartedWhileCreatePendingRefetchesNewSearch: Story = {
  args: { initialIsCreating: true },
  render: args => renderSearchRaceStory(args),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const environment = storyEnvironment()
    const titles: Array<string | null | undefined> = []

    await waitFor(
      () =>
        expect(
          pendingOperationsNamed(environment, 'TasksListStoryInnerQuery')
            .length,
        ).toBeGreaterThan(0),
      { timeout: 3000 },
    )
    resolveOperations(environment, 'TasksListStoryInnerQuery')
    await canvas.findByText('Pushups')

    const textbox = await canvas.findByRole('textbox', { name: /task name/i })
    await userEvent.type(textbox, 'Milk new')
    await userEvent.click(canvas.getByRole('button', { name: /save/i }))

    await waitFor(
      () =>
        expect(
          pendingOperationsNamed(environment, 'CreateTaskMutation'),
        ).toEqual([expect.anything()]),
      { timeout: 3000 },
    )

    const search = await firstSearchInput(canvas)
    await userEvent.type(search, 'Walk')
    titles.push(...(await drainSearchOperations(environment)))
    expect(titles).toEqual(['Walk'])

    resolveOperations(environment, 'CreateTaskMutation')

    titles.push(...(await drainSearchOperations(environment)))
    expect(titles).toEqual(['Walk', 'Walk'])
  },
}

export const ReturnToAppRefetchesActiveSearch: Story = {
  render: args => renderSearchRaceStory(args),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const environment = storyEnvironment()
    const titles: Array<string | null | undefined> = []

    await waitFor(
      () =>
        expect(
          pendingOperationsNamed(environment, 'TasksListStoryInnerQuery')
            .length,
        ).toBeGreaterThan(0),
      { timeout: 3000 },
    )
    resolveOperations(environment, 'TasksListStoryInnerQuery')
    await canvas.findByText('Pushups')

    const search = await firstSearchInput(canvas)
    await userEvent.type(search, 'Walk')
    titles.push(...(await drainSearchOperations(environment)))
    expect(titles).toEqual(['Walk'])

    const disposable = commitMutation<CreateTaskMutationType>(environment, {
      mutation: CreateTaskMutation,
      variables: { title: 'Later', icon: null, connections: [] },
      updater: invalidateStoreOnSuccess('createTask'),
    })
    await waitFor(
      () =>
        expect(
          pendingOperationsNamed(environment, 'CreateTaskMutation').length,
        ).toBeGreaterThan(0),
      { timeout: 3000 },
    )
    resolveOperations(environment, 'CreateTaskMutation')
    disposable.dispose()

    expect(
      pendingOperationsNamed(environment, 'TasksListPaginationQuery'),
    ).toEqual([])

    document.dispatchEvent(new Event('visibilitychange'))

    titles.push(...(await drainSearchOperations(environment)))
    expect(titles).toEqual(['Walk', 'Walk'])
  },
}

export const CreateTaskRollback: Story = {
  render: () => <CreateTaskRollbackStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const textbox = await canvas.findByRole('textbox', { name: /task name/i })
    expect(textbox).toBeInTheDocument()

    await userEvent.type(textbox, 'New Task')
    await userEvent.click(canvas.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(
        canvas.queryByRole('textbox', { name: /task name/i }),
      ).not.toBeInTheDocument()
    })

    expect(await canvas.findByText('New Task')).toBeInTheDocument()

    await waitFor(() => {
      expect(canvas.queryByText('New Task')).not.toBeInTheDocument()
    })

    expect(await canvas.findByText('Pushups')).toBeInTheDocument()
  },
}
