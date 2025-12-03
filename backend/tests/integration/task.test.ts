import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { db, type Database } from '../../src/database/index.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTestApp, executeGraphQL } from '../helpers/graphql.ts'
import type { createApp } from '../../src/main.ts'

const createTaskMutation = `
  mutation CreateTask($title: String!) {
    createTask(title: $title) {
      success
      taskEdge {
        node {
          id
          title
        }
      }
    }
  }
`

const updateTaskMutation = `
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      task {
        id
        title
      }
    }
  }
`

describe('Task operations', () => {
  let yoga: Awaited<ReturnType<typeof createApp>>['yoga']

  beforeAll(async () => {
    const { yoga: testYoga } = await createTestApp()
    yoga = testYoga
  })

  beforeEach(async () => {
    await clearAllTables()
  })

  it('can create a new task for a user via createTask mutation', async () => {
    const token = await createTestUser()
    const result = await executeGraphQL(
      yoga,
      createTaskMutation,
      {
        title: 'Test Task',
      },
      token,
    )

    expect(result.data?.createTask.taskEdge.node.title).toBe('Test Task')
    expect(result.data?.createTask.taskEdge.node.id).toBeDefined()
  })

  it('can update a task that is created for a user via the updateTask mutation', async () => {
    const token = await createTestUser()
    const firstResult = await executeGraphQL(
      yoga,
      createTaskMutation,
      { title: 'Another test task' },
      token,
    )
    console.debug(firstResult)

    expect(firstResult.data?.success).toBe(true)
    const secondResult = await executeGraphQL(
      yoga,
      updateTaskMutation,
      {
        input: {
          title: 'My changed title',
          taskId: firstResult.data?.createTask.taskEdge.node.id,
        },
      },
      token,
    )

    expect(secondResult.data?.success).toBe(true)
    expect(secondResult.data?.createTask.taskEdge.node.title).toBe(
      'My changed title',
    )
    expect(secondResult.data?.createTask.taskEdge.node.id).toBe(
      firstResult.data?.createTask.taskEdge.node.id,
    )
  })
})
