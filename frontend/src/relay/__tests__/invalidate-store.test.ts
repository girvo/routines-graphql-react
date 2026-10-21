import { describe, expect, it, vi } from 'vitest'
import {
  commitMutation,
  createOperationDescriptor,
  fetchQuery,
  type ConcreteRequest,
  type MutationParameters,
  type Variables,
} from 'relay-runtime'
import {
  createMockEnvironment,
  MockPayloadGenerator,
  type MockEnvironment,
} from 'relay-test-utils'
import { invalidateStoreOnSuccess } from '../invalidate-store.ts'
import TaskDeleteMutation, {
  type TaskDeleteMutation as TaskDeleteMutationType,
} from '../../Tasks/__generated__/TaskDeleteMutation.graphql.ts'
import CreateTaskMutation, {
  type CreateTaskMutation as CreateTaskMutationType,
} from '../../Tasks/__generated__/CreateTaskMutation.graphql.ts'
import EditTaskMutation, {
  type EditTaskMutation as EditTaskMutationType,
} from '../../Tasks/__generated__/EditTaskMutation.graphql.ts'
import TasksPageQuery from '../../Tasks/__generated__/TasksPageQuery.graphql.ts'
import TodayPageQuery from '../../Today/__generated__/TodayPageQuery.graphql.ts'
import WeeklyPlanPageQuery from '../../WeeklyPlan/__generated__/WeeklyPlanPageQuery.graphql.ts'
import AddTaskDropdownQuery from '../../WeeklyPlan/__generated__/AddTaskDropdownQuery.graphql.ts'
import AddTaskDropdownRoutineSlotMutation, {
  type AddTaskDropdownRoutineSlotMutation as AddTaskDropdownRoutineSlotMutationType,
} from '../../WeeklyPlan/__generated__/AddTaskDropdownRoutineSlotMutation.graphql.ts'
import RoutineSlotItemMutation, {
  type RoutineSlotItemMutation as RoutineSlotItemMutationType,
} from '../../WeeklyPlan/__generated__/RoutineSlotItemMutation.graphql.ts'
import DaySectionMoveTaskMutation, {
  type DaySectionMoveTaskMutation as DaySectionMoveTaskMutationType,
} from '../../WeeklyPlan/__generated__/DaySectionMoveTaskMutation.graphql.ts'

// relay-test-utils calls jest.fn at env creation; vitest provides no `jest` global.
;(globalThis as Record<string, unknown>).jest = { fn: vi.fn }

const TODAY = { date: '2026-10-21T12:00:00.000Z' }
const MONDAY = { dayOfWeek: 'MONDAY' }
const TUESDAY = { dayOfWeek: 'TUESDAY' }

const seed = (
  environment: MockEnvironment,
  node: ConcreteRequest,
  variables: Variables = {},
) => {
  const subscription = fetchQuery(environment, node, variables, {
    fetchPolicy: 'store-or-network',
  }).subscribe({ error: () => {} })
  environment.mock.resolveMostRecentOperation(operation =>
    MockPayloadGenerator.generate(operation),
  )
  subscription.unsubscribe()
}

const dataStatus = (
  environment: MockEnvironment,
  node: ConcreteRequest,
  variables: Variables = {},
) => environment.check(createOperationDescriptor(node, variables)).status

const pendingRequestCount = (environment: MockEnvironment) =>
  environment.mock.getAllOperations().length

const refetchWithoutNewRequest = (
  environment: MockEnvironment,
  node: ConcreteRequest,
  variables: Variables = {},
) => {
  const before = pendingRequestCount(environment)
  fetchQuery(environment, node, variables, {
    fetchPolicy: 'store-or-network',
  }).subscribe({ error: () => {} })
  expect(pendingRequestCount(environment)).toBe(before)
}

const commitWithInvalidation = <T extends MutationParameters>(
  environment: MockEnvironment,
  mutation: ConcreteRequest,
  variables: Variables,
  payloadField: string,
) => {
  const disposable = commitMutation<T>(environment, {
    mutation,
    variables,
    updater: invalidateStoreOnSuccess(payloadField),
    onError: () => {},
  })
  environment.mock.resolveMostRecentOperation(operation =>
    MockPayloadGenerator.generate(operation),
  )
  disposable.dispose()
}

describe('task deletion', () => {
  it('marks every cached query stale and forces refetch on revisit', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)
    seed(environment, WeeklyPlanPageQuery, MONDAY)
    seed(environment, TodayPageQuery, TODAY)
    seed(environment, AddTaskDropdownQuery)

    expect([
      dataStatus(environment, TasksPageQuery),
      dataStatus(environment, WeeklyPlanPageQuery, MONDAY),
      dataStatus(environment, TodayPageQuery, TODAY),
      dataStatus(environment, AddTaskDropdownQuery),
    ]).toEqual(['available', 'available', 'available', 'available'])
    refetchWithoutNewRequest(environment, TasksPageQuery)

    commitWithInvalidation<TaskDeleteMutationType>(
      environment,
      TaskDeleteMutation,
      { taskId: 'task-1', connections: [] },
      'deleteTask',
    )

    expect([
      dataStatus(environment, TasksPageQuery),
      dataStatus(environment, WeeklyPlanPageQuery, MONDAY),
      dataStatus(environment, TodayPageQuery, TODAY),
      dataStatus(environment, AddTaskDropdownQuery),
    ]).toEqual(['stale', 'stale', 'stale', 'stale'])

    const before = pendingRequestCount(environment)
    fetchQuery(
      environment,
      TasksPageQuery,
      {},
      { fetchPolicy: 'store-or-network' },
    ).subscribe({ error: () => {} })
    expect(pendingRequestCount(environment)).toBe(before + 1)
  })
})

describe('routine slot creation from the task picker', () => {
  it('marks Today, the weekly plan and the task list stale', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)
    seed(environment, WeeklyPlanPageQuery, MONDAY)
    seed(environment, TodayPageQuery, TODAY)

    commitWithInvalidation<AddTaskDropdownRoutineSlotMutationType>(
      environment,
      AddTaskDropdownRoutineSlotMutation,
      {
        taskId: 'task-1',
        dayOfWeek: 'MONDAY',
        daySection: 'MORNING',
        connections: [],
      },
      'createRoutineSlot',
    )

    expect([
      dataStatus(environment, TasksPageQuery),
      dataStatus(environment, WeeklyPlanPageQuery, MONDAY),
      dataStatus(environment, TodayPageQuery, TODAY),
    ]).toEqual(['stale', 'stale', 'stale'])
  })
})

describe('routine slot removal across cached days', () => {
  it('marks both cached planner days, Today and the task list stale', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)
    seed(environment, WeeklyPlanPageQuery, MONDAY)
    seed(environment, WeeklyPlanPageQuery, TUESDAY)
    seed(environment, TodayPageQuery, TODAY)

    commitWithInvalidation<RoutineSlotItemMutationType>(
      environment,
      RoutineSlotItemMutation,
      { routineSlotId: 'slot-1', connections: [] },
      'deleteRoutineSlot',
    )

    expect([
      dataStatus(environment, TasksPageQuery),
      dataStatus(environment, WeeklyPlanPageQuery, MONDAY),
      dataStatus(environment, WeeklyPlanPageQuery, TUESDAY),
      dataStatus(environment, TodayPageQuery, TODAY),
    ]).toEqual(['stale', 'stale', 'stale', 'stale'])
  })
})

describe('slot reordering', () => {
  it('marks Today and the task list stale even though the payload refreshes the section', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)
    seed(environment, WeeklyPlanPageQuery, MONDAY)
    seed(environment, TodayPageQuery, TODAY)

    commitWithInvalidation<DaySectionMoveTaskMutationType>(
      environment,
      DaySectionMoveTaskMutation,
      { input: { routineSlotId: 'slot-1', beforeRoutineSlotId: 'slot-2' } },
      'moveRoutineSlot',
    )

    expect([
      dataStatus(environment, TasksPageQuery),
      dataStatus(environment, WeeklyPlanPageQuery, MONDAY),
      dataStatus(environment, TodayPageQuery, TODAY),
    ]).toEqual(['stale', 'stale', 'stale'])
  })
})

describe('task creation and renaming while a filtered search is cached', () => {
  it('marks the task list and task picker stale after creation', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)
    seed(environment, AddTaskDropdownQuery)

    commitWithInvalidation<CreateTaskMutationType>(
      environment,
      CreateTaskMutation,
      { title: 'New task', icon: null, connections: [] },
      'createTask',
    )

    expect([
      dataStatus(environment, TasksPageQuery),
      dataStatus(environment, AddTaskDropdownQuery),
    ]).toEqual(['stale', 'stale'])
  })

  it('marks the task list and task picker stale after a rename', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)
    seed(environment, AddTaskDropdownQuery)

    commitWithInvalidation<EditTaskMutationType>(
      environment,
      EditTaskMutation,
      { input: { taskId: 'task-1', title: 'Renamed task', icon: null } },
      'updateTask',
    )

    expect([
      dataStatus(environment, TasksPageQuery),
      dataStatus(environment, AddTaskDropdownQuery),
    ]).toEqual(['stale', 'stale'])
  })
})

describe('mutations with payload errors', () => {
  it('does not invalidate the store when the mutation payload has errors', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)

    const disposable = commitMutation<TaskDeleteMutationType>(environment, {
      mutation: TaskDeleteMutation,
      variables: { taskId: 'task-1', connections: [] },
      updater: invalidateStoreOnSuccess('deleteTask'),
      onError: () => {},
    })
    environment.mock.resolveMostRecentOperation(() => ({
      data: { deleteTask: null },
      errors: [{ message: 'Task not found' }],
    }))
    disposable.dispose()

    expect(dataStatus(environment, TasksPageQuery)).toBe('available')
    refetchWithoutNewRequest(environment, TasksPageQuery)
  })
})

describe('failed mutations', () => {
  it('leaves the store fresh and rolls back the optimistic deletion', () => {
    const environment = createMockEnvironment()
    seed(environment, TasksPageQuery)

    const disposable = commitMutation<TaskDeleteMutationType>(environment, {
      mutation: TaskDeleteMutation,
      variables: { taskId: 'task-1', connections: [] },
      // TaskDeleteMutation has no @raw_response_type, so commitMutation's
      // optimisticResponse is typed undefined; useMutation types it unknown.
      optimisticResponse: { deleteTask: { deletedId: 'task-1' } } as never,
      updater: invalidateStoreOnSuccess('deleteTask'),
      onError: () => {},
    })
    environment.mock.rejectMostRecentOperation(new Error('network down'))
    disposable.dispose()

    expect(dataStatus(environment, TasksPageQuery)).toBe('available')
    refetchWithoutNewRequest(environment, TasksPageQuery)
  })
})
