import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import {
  createTestApp,
  executeGraphQL,
  type YogaApp,
} from '../helpers/graphql.ts'
import { graphql } from '../gql/gql.ts'

const CreateTaskMutation = graphql(`
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
`)

describe('Task operations', () => {
  let yoga: YogaApp

  beforeAll(async () => {
    const { yoga: testYoga } = await createTestApp()
    yoga = testYoga
  })

  beforeEach(async () => {
    await clearAllTables()
  })

  it('can create a new task for a user via createTask mutation', async () => {
    const { userToken } = await createTestUser()
    const result = await executeGraphQL(
      CreateTaskMutation,
      {
        title: 'Test Task',
      },
      { yoga, userToken },
    )

    expect(result.data?.createTask.taskEdge.node.title).toBe('Test Task')
    expect(result.data?.createTask.taskEdge.node.id).toBeDefined()
  })

  it('can update a task that is created for a user via the updateTask mutation', async () => {
    const { userToken } = await createTestUser()
    const firstResult = await executeGraphQL(
      CreateTaskMutation,
      { title: 'Another test task' },
      { yoga, userToken },
    )

    expect(firstResult.errors).toBeUndefined()
    expect(firstResult.data?.createTask.taskEdge.node.id).toBeDefined()

    const secondResult = await executeGraphQL(
      graphql(`
        mutation UpdateTask($input: UpdateTaskInput!) {
          updateTask(input: $input) {
            task {
              id
              title
            }
          }
        }
      `),
      {
        input: {
          title: 'My changed title',
          taskId: firstResult.data!.createTask.taskEdge.node.id,
        },
      },
      { yoga, userToken },
    )

    expect(secondResult.data?.updateTask.task.title).toBe('My changed title')
    expect(secondResult.data?.updateTask.task.id).toBe(
      firstResult.data?.createTask.taskEdge.node.id,
    )
  })

  it('can delete a task that is created for a user via the deleteTask mutation', async () => {
    const { userToken } = await createTestUser()
    const createResult = await executeGraphQL(
      CreateTaskMutation,
      { title: 'Task to delete' },
      { yoga, userToken },
    )

    expect(createResult.errors).toBeUndefined()
    expect(createResult.data?.createTask.taskEdge.node.id).toBeDefined()

    const deleteResult = await executeGraphQL(
      graphql(`
        mutation DeleteTask($taskId: ID!) {
          deleteTask(taskId: $taskId) {
            deletedId
          }
        }
      `),
      { taskId: createResult.data!.createTask.taskEdge.node.id },
      { yoga, userToken },
    )

    expect(deleteResult.errors).toBeUndefined()
    expect(deleteResult.data?.deleteTask.deletedId).toBe(
      createResult.data?.createTask.taskEdge.node.id,
    )
  })
})
