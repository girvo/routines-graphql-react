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

let yoga: YogaApp

beforeAll(async () => {
  const { yoga: testYoga } = await createTestApp()
  yoga = testYoga
})

beforeEach(async () => {
  await clearAllTables()
})

describe('Routine mutations', () => {
  it('can create a routine slot with a given task', async () => {
    // Setup user and task to put into the routine slot
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'A task', yoga, userToken })
    assert(
      task.data?.createTask.taskEdge.node !== undefined,
      'task was created',
    )

    // This doesn't use the helper so we can test more stuff
    const result = await executeGraphQL(
      graphql(`
        mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {
          createRoutineSlot(input: $input) {
            routineSlotEdge {
              node {
                id
                task {
                  id
                  title
                }
                dayOfWeek
                section
                createdAt
              }
              cursor
            }
          }
        }
      `),
      {
        input: {
          taskId: task.data.createTask.taskEdge.node.id,
          dayOfWeek: 'MONDAY',
          section: 'MORNING',
        },
      },
      { yoga, userToken },
    )
    const routineSlot = result.data?.createRoutineSlot.routineSlotEdge.node
    expect(result.errors).toBeUndefined()
    assert(routineSlot !== undefined, 'slot was created')
    expect(routineSlot.dayOfWeek).toBe('MONDAY')
    expect(routineSlot.section).toBe('MORNING')
    expect(routineSlot.task.id).toBe(task.data.createTask.taskEdge.node.id)
    expect(routineSlot.task.title).toBe('A task')
  })

  it('can delete the routine slot once created', async () => {
    // Setup user and task to put into the routine slot
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'A task', yoga, userToken })
    assert(
      task.data?.createTask.taskEdge.node !== undefined,
      'task was created',
    )

    const slot = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'THURSDAY',
        section: 'MIDDAY',
      },
      yoga,
      userToken,
    })
    const routineSlot = slot.data?.createRoutineSlot.routineSlotEdge.node
    expect(slot.errors).toBeUndefined()
    assert(routineSlot !== undefined, 'slot was created')

    const result = await executeGraphQL(
      graphql(`
        mutation DeleteRoutineSlot($routineSlotId: ID!) {
          deleteRoutineSlot(routineSlotId: $routineSlotId) {
            deletedId
          }
        }
      `),
      { routineSlotId: routineSlot.id },
      { yoga, userToken },
    )
    expect(result.errors).toBeUndefined()
    expect(result.data?.deleteRoutineSlot.deletedId).toBe(routineSlot.id)
  })
})

describe('Task.slots query resolver', () => {
  it('can get a single slot from a given task', async () => {
    const { userToken } = await createTestUser()
    const task = await createTask({ title: 'Task one', yoga, userToken })
    assert(
      task.data?.createTask.taskEdge.node !== undefined,
      'Task was created successfully',
    )

    const slot = await createRoutineSlot({
      input: {
        taskId: task.data.createTask.taskEdge.node.id,
        dayOfWeek: 'THURSDAY',
        section: 'MIDDAY',
      },
      yoga,
      userToken,
    })

    const taskQuery = await executeGraphQL(
      graphql(`
        query TaskResolverQuery {
          tasks {
            edges {
              node {
                title
                slots {
                  edges {
                    node {
                      dayOfWeek
                      section
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
    expect(selectedTask.slots.edges.length).toBe(1)
    expect(selectedTask.slots.edges?.[0].node.dayOfWeek).toBe('THURSDAY')
    expect(selectedTask.slots.edges?.[0].node.section).toBe('MIDDAY')
  })
})
