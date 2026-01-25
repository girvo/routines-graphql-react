/**
 * Test for Node resolver to ensure it works as expected
 */
import { assert, describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTask } from '../helpers/tasks.ts'
import {
  createTestApp,
  executeGraphQL,
  type YogaApp,
} from '../helpers/graphql.ts'
import { graphql } from '../gql/gql.ts'
import { createRoutineSlot } from '../helpers/routine-slot.ts'
import { completeRoutineSlot } from '../helpers/task-completion.ts'

let yoga: YogaApp

beforeAll(async () => {
  const { yoga: testYoga } = await createTestApp()
  yoga = testYoga
})

beforeEach(async () => {
  await clearAllTables()
})

const NodeQuery = graphql(`
  query NodeQuery($id: ID!) {
    node(id: $id) {
      __typename
      ... on User {
        id
        email
      }

      ... on Task {
        id
        title
      }

      ... on RoutineSlot {
        id
        dayOfWeek
        section
        task {
          id
          title
        }
      }

      ... on TaskCompletion {
        id
        completedAt
        routineSlot {
          id
          dayOfWeek
          section
        }
      }
    }
  }
`)

describe('Node resolver', () => {
  it('correctly resolves the User node', async () => {
    const { userToken, globalId } = await createTestUser()

    const userNode = await executeGraphQL(
      NodeQuery,
      { id: globalId },
      { yoga, userToken },
    )

    assert(userNode.data?.node?.__typename === 'User', 'Got a user back')
    expect(userNode.data?.node.email).toBe('test@example.com')
    expect(userNode.data?.node.id).toBe(globalId)
  })

  it('correctly resolves the Task node', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'Test task', yoga, userToken })
    assert(
      task.data?.createTask?.taskEdge.node.id !== undefined,
      'Created a task',
    )

    const taskNode = await executeGraphQL(
      NodeQuery,
      { id: task.data?.createTask?.taskEdge.node.id },
      { yoga, userToken },
    )

    assert(taskNode.data?.node?.__typename === 'Task', 'Got a task back')
    expect(taskNode.data?.node.title).toBe('Test task')
    expect(taskNode.data?.node.id).toBe(task.data?.createTask?.taskEdge.node.id)
  })

  it('correctly resolves the RoutineSlot node', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'Morning task', yoga, userToken })
    assert(
      task.data?.createTask?.taskEdge.node.id !== undefined,
      'Created a task',
    )

    const routineSlot = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })
    assert(
      routineSlot.data?.createRoutineSlot?.routineSlotEdge.node.id !== undefined,
      'Created a routine slot',
    )

    const routineSlotNode = await executeGraphQL(
      NodeQuery,
      { id: routineSlot.data.createRoutineSlot.routineSlotEdge.node.id },
      { yoga, userToken },
    )

    assert(
      routineSlotNode.data?.node?.__typename === 'RoutineSlot',
      'Got a routine slot back',
    )
    expect(routineSlotNode.data?.node.dayOfWeek).toBe('MONDAY')
    expect(routineSlotNode.data?.node.section).toBe('MORNING')
    expect(routineSlotNode.data?.node.task.title).toBe('Morning task')
    expect(routineSlotNode.data?.node.id).toBe(
      routineSlot.data.createRoutineSlot.routineSlotEdge.node.id,
    )
  })

  it('correctly resolves the TaskCompletion node', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'Evening task', yoga, userToken })
    assert(
      task.data?.createTask?.taskEdge.node.id !== undefined,
      'Created a task',
    )

    const routineSlot = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'TUESDAY',
        section: 'EVENING',
      },
      yoga,
      userToken,
    })
    assert(
      routineSlot.data?.createRoutineSlot?.routineSlotEdge.node.id !== undefined,
      'Created a routine slot',
    )

    const completion = await completeRoutineSlot({
      routineSlotId:
        routineSlot.data.createRoutineSlot.routineSlotEdge.node.id,
      yoga,
      userToken,
    })
    assert(
      completion.data?.completeRoutineSlot?.taskCompletionEdge.node.id !==
        undefined,
      'Created a task completion',
    )

    const completionNode = await executeGraphQL(
      NodeQuery,
      { id: completion.data.completeRoutineSlot.taskCompletionEdge.node.id },
      { yoga, userToken },
    )

    assert(
      completionNode.data?.node?.__typename === 'TaskCompletion',
      'Got a task completion back',
    )
    expect(completionNode.data?.node.completedAt).toBeDefined()
    expect(completionNode.data?.node.routineSlot.dayOfWeek).toBe('TUESDAY')
    expect(completionNode.data?.node.routineSlot.section).toBe('EVENING')
    expect(completionNode.data?.node.id).toBe(
      completion.data.completeRoutineSlot.taskCompletionEdge.node.id,
    )
  })
})
