import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { gql } from 'graphql-tag'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTestApp, executeGraphQL } from '../helpers/graphql.ts'
import type { createApp } from '../../src/main.ts'
import {
  CreateTaskDocument,
  UpdateTaskDocument,
} from './task.test.generated.ts'

const createTaskMutation = gql`
  mutation CreateTask($title: String!) {
    createTask(title: $title) {
      taskEdge {
        node {
          id
          title
        }
      }
    }
  }
`

const updateTaskMutation = gql`
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
      CreateTaskDocument,
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
      CreateTaskDocument,
      { title: 'Another test task' },
      token,
    )
    console.debug(firstResult)

    expect(firstResult.errors ?? []).toHaveLength(0)
    expect(firstResult.data?.createTask.taskEdge.node.id).toBeDefined()

    const secondResult = await executeGraphQL(
      yoga,
      UpdateTaskDocument,
      {
        input: {
          title: 'My changed title',
          taskId: firstResult.data!.createTask.taskEdge.node.id,
        },
      },
      token,
    )

    expect(secondResult.data?.updateTask.task.title).toBe('My changed title')
    expect(secondResult.data?.updateTask.task.id).toBe(
      firstResult.data?.createTask.taskEdge.node.id,
    )
  })
})
