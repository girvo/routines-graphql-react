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
})
