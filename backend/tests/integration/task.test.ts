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

let yoga: YogaApp

beforeAll(async () => {
  const { yoga: testYoga } = await createTestApp()
  yoga = testYoga
})

beforeEach(async () => {
  await clearAllTables()
})

describe('Task mutations', () => {
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

describe('Task queries', () => {
  it('can select one created task via the tasks() resolver', async () => {
    const { userToken } = await createTestUser()
    const createResult = await executeGraphQL(
      CreateTaskMutation,
      { title: 'Task to select' },
      { yoga, userToken },
    )
    expect(createResult.errors).toBeUndefined()

    const tasksResult = await executeGraphQL(
      graphql(`
        query TasksTestOne {
          tasks(first: 1) {
            edges {
              node {
                title
              }
            }
          }
        }
      `),
      {},
      { yoga, userToken },
    )
    expect(tasksResult.errors).toBeUndefined()
    expect(tasksResult.data?.tasks.edges.length).toEqual(1)
    expect(tasksResult.data?.tasks.edges[0].node.title).toEqual(
      'Task to select',
    )
  })

  it('tasks query has working pagination', async () => {
    const { userToken } = await createTestUser()

    // Let's create ~20 tasks or so
    const created = await Promise.all(
      Array.from({ length: 21 }, (_, i) =>
        executeGraphQL(
          CreateTaskMutation,
          { title: `Task to select ${i}` },
          { yoga, userToken },
        ),
      ),
    )

    // ensure they're created correctly
    created.map(res => expect(res.errors).toBeUndefined())

    // now select the first page
    const selected = await executeGraphQL(
      graphql(`
        query PaginatedTasksOne {
          tasks(first: 10) {
            edges {
              node {
                id
              }
            }
            pageInfo {
              hasNextPage
              endCursor
              startCursor
            }
          }
        }
      `),
      {},
      { yoga, userToken },
    )

    expect(selected.data?.tasks.edges.length).toEqual(10)
    expect(selected.data?.tasks.pageInfo.hasNextPage).toBe(true)

    const nextPage = await executeGraphQL(
      graphql(`
        query PaginatedTasksTwo($after: String) {
          tasks(first: 10, after: $after) {
            edges {
              node {
                id
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `),
      { after: selected.data?.tasks.pageInfo.endCursor },
      { yoga, userToken },
    )
    console.debug(nextPage.data?.tasks.edges)
    expect(nextPage.data?.tasks.edges.length).toEqual(10)
    expect(nextPage.data?.tasks.pageInfo.hasNextPage).toBe(true)

    const finalPage = await executeGraphQL(
      graphql(`
        query PaginatedTasksThree($after: String) {
          tasks(first: 10, after: $after) {
            edges {
              node {
                __typename
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `),
      { after: nextPage.data?.tasks.pageInfo.endCursor },
      { yoga, userToken },
    )
    expect(selected.data?.tasks.edges.length).toEqual(1)
    expect(selected.data?.tasks.pageInfo.hasNextPage).toBe(false)
  })
})
