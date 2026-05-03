import { assert, describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTask } from '../helpers/tasks.ts'
import { createRoutineSlot } from '../helpers/routine-slot.ts'
import {
  createTestApp,
  executeGraphQL,
  type YogaApp,
} from '../helpers/graphql.ts'
import { graphql } from '../gql/gql.ts'
import { dailyTaskInstanceIdFor } from '../helpers/task-completion.ts'

let yoga: YogaApp

beforeAll(async () => {
  const { yoga: testYoga } = await createTestApp()
  yoga = testYoga
})

beforeEach(async () => {
  await clearAllTables()
})

describe('Task completion mutations', () => {
  it('can complete a routine slot via completeRoutineSlot mutation', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({
      title: 'Morning exercise',
      yoga,
      userToken,
    })
    assert(
      task.data?.createTask?.taskEdge.node !== undefined,
      'task was created',
    )

    const slotResult = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })

    expect(slotResult.errors).toBeUndefined()
    assert(
      slotResult.data?.createRoutineSlot?.routineSlotEdge.node !== undefined,
      'routine slot was created',
    )

    const completionResult = await executeGraphQL(
      graphql(`
        mutation CompleteRoutineSlot($dailyTaskInstanceId: ID!) {
          completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
            taskCompletionEdge {
              node {
                id
                completedAt
                routineSlot {
                  id
                  task {
                    id
                    title
                  }
                }
              }
              cursor
            }
          }
        }
      `),
      {
        dailyTaskInstanceId: dailyTaskInstanceIdFor(
          slotResult.data.createRoutineSlot.routineSlotEdge.node.id,
          new Date(),
        ),
      },
      { yoga, userToken },
    )

    expect(completionResult.errors).toBeUndefined()
    const completion =
      completionResult.data?.completeRoutineSlot?.taskCompletionEdge.node
    assert(completion !== undefined, 'completion was created')
    expect(completion.routineSlot.id).toBe(
      slotResult.data.createRoutineSlot.routineSlotEdge.node.id,
    )
    expect(completion.routineSlot.task.title).toBe('Morning exercise')
    expect(completion.completedAt).toBeDefined()
  })

  it('can uncomplete a routine slot via uncompleteRoutineSlot mutation', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'Evening reading', yoga, userToken })
    assert(
      task.data?.createTask?.taskEdge.node !== undefined,
      'task was created',
    )

    const slotResult = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'TUESDAY',
        section: 'EVENING',
      },
      yoga,
      userToken,
    })

    expect(slotResult.errors).toBeUndefined()
    assert(
      slotResult.data?.createRoutineSlot?.routineSlotEdge.node !== undefined,
      'routine slot was created',
    )

    const dailyTaskInstanceId = dailyTaskInstanceIdFor(
      slotResult.data.createRoutineSlot.routineSlotEdge.node.id,
      new Date(),
    )

    const completionResult = await executeGraphQL(
      graphql(`
        mutation CompleteRoutineSlotForUncompletion($dailyTaskInstanceId: ID!) {
          completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
            taskCompletionEdge {
              node {
                id
              }
            }
          }
        }
      `),
      { dailyTaskInstanceId },
      { yoga, userToken },
    )

    expect(completionResult.errors).toBeUndefined()
    assert(
      completionResult.data?.completeRoutineSlot?.taskCompletionEdge.node !==
        undefined,
      'completion was created',
    )

    const taskCompletionId =
      completionResult.data.completeRoutineSlot.taskCompletionEdge.node.id

    const uncompletionResult = await executeGraphQL(
      graphql(`
        mutation UncompleteRoutineSlot($dailyTaskInstanceId: ID!) {
          uncompleteRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
            deletedId
          }
        }
      `),
      { dailyTaskInstanceId },
      { yoga, userToken },
    )

    expect(uncompletionResult.errors).toBeUndefined()
    expect(uncompletionResult.data?.uncompleteRoutineSlot?.deletedId).toBe(
      taskCompletionId,
    )
  })

  it('cannot complete the same routine slot multiple times on the same day', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({
      title: 'Daily meditation',
      yoga,
      userToken,
    })
    assert(
      task.data?.createTask?.taskEdge.node !== undefined,
      'task was created',
    )

    const slotResult = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'WEDNESDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })

    expect(slotResult.errors).toBeUndefined()
    assert(
      slotResult.data?.createRoutineSlot?.routineSlotEdge.node !== undefined,
      'routine slot was created',
    )

    const dailyTaskInstanceId = dailyTaskInstanceIdFor(
      slotResult.data.createRoutineSlot.routineSlotEdge.node.id,
      new Date(),
    )

    const firstCompletion = await executeGraphQL(
      graphql(`
        mutation FirstCompletion($dailyTaskInstanceId: ID!) {
          completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
            taskCompletionEdge {
              node {
                id
              }
            }
          }
        }
      `),
      { dailyTaskInstanceId },
      { yoga, userToken },
    )

    expect(firstCompletion.errors).toBeUndefined()
    assert(
      firstCompletion.data?.completeRoutineSlot?.taskCompletionEdge.node !==
        undefined,
      'first completion was created',
    )

    const secondCompletion = await executeGraphQL(
      graphql(`
        mutation SecondCompletion($dailyTaskInstanceId: ID!) {
          completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
            taskCompletionEdge {
              node {
                id
              }
            }
          }
        }
      `),
      { dailyTaskInstanceId },
      { yoga, userToken },
    )

    expect(secondCompletion.errors).toBeDefined()
    expect(secondCompletion.errors?.[0].message).toMatch(
      /UNIQUE constraint failed:/,
    )
  })

  it('cannot complete a routine slot owned by another user', async () => {
    const { userToken: ownerToken } = await createTestUser()
    const { userToken: otherToken } = await createTestUser()

    const task = await createTask({ title: 'Owner task', yoga, userToken: ownerToken })
    const taskId = task.data!.createTask!.taskEdge.node.id

    const slot = await createRoutineSlot({
      input: { taskId, dayOfWeek: 'MONDAY', section: 'MORNING' },
      yoga,
      userToken: ownerToken,
    })
    const routineSlotId = slot.data!.createRoutineSlot!.routineSlotEdge.node.id

    const result = await executeGraphQL(
      graphql(`
        mutation CannotCompleteOtherUsersRoutineSlot($dailyTaskInstanceId: ID!) {
          completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
            taskCompletionEdge {
              node {
                id
              }
            }
          }
        }
      `),
      {
        dailyTaskInstanceId: dailyTaskInstanceIdFor(routineSlotId, new Date()),
      },
      { yoga, userToken: otherToken },
    )

    expect(result.errors).toBeDefined()
    expect(result.errors?.[0].message).toBe('Routine slot not found')

    const otherCompletions = await executeGraphQL(
      graphql(`
        query OtherUsersCompletionsAfterUnauthorizedComplete {
          taskCompletions(first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      `),
      {},
      { yoga, userToken: otherToken },
    )

    expect(otherCompletions.errors).toBeUndefined()
    expect(otherCompletions.data?.taskCompletions.edges.length).toBe(0)
  })
})

describe('Task.completions query resolver', () => {
  it('can get completions from a given task', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'Task one', yoga, userToken })
    assert(
      task.data?.createTask?.taskEdge.node !== undefined,
      'Task was created successfully',
    )

    const slot = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'FRIDAY',
        section: 'EVENING',
      },
      yoga,
      userToken,
    })

    assert(
      slot.data?.createRoutineSlot?.routineSlotEdge.node !== undefined,
      'Routine slot was created',
    )

    const completionResult = await executeGraphQL(
      graphql(`
        mutation CompleteForTaskCompletionsTest($dailyTaskInstanceId: ID!) {
          completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
            taskCompletionEdge {
              node {
                id
              }
            }
          }
        }
      `),
      {
        dailyTaskInstanceId: dailyTaskInstanceIdFor(
          slot.data.createRoutineSlot.routineSlotEdge.node.id,
          new Date(),
        ),
      },
      { yoga, userToken },
    )

    expect(completionResult.errors).toBeUndefined()

    const taskQuery = await executeGraphQL(
      graphql(`
        query TaskCompletionsResolverQuery {
          tasks {
            edges {
              node {
                title
                completions {
                  edges {
                    node {
                      id
                      completedAt
                      routineSlot {
                        dayOfWeek
                        section
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `),
      {},
      { yoga, userToken },
    )

    const selectedTask = taskQuery.data?.tasks?.edges[0].node
    assert(selectedTask !== undefined, 'Task was selected successfully')
    expect(taskQuery.errors).toBeUndefined()
    expect(selectedTask.title).toBe('Task one')
    expect(selectedTask.completions.edges.length).toBe(1)
    expect(selectedTask.completions.edges?.[0].node.completedAt).toBeDefined()
    expect(selectedTask.completions.edges?.[0].node.routineSlot.dayOfWeek).toBe(
      'FRIDAY',
    )
    expect(selectedTask.completions.edges?.[0].node.routineSlot.section).toBe(
      'EVENING',
    )
  })
})
