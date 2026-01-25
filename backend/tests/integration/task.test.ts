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

describe('Task mutations', () => {
  it('can create a new task for a user via createTask mutation', async () => {
    const { userToken } = await createTestUser()
    const result = await createTask({ title: 'Test Task', yoga, userToken })

    expect(result.data?.createTask.taskEdge.node.title).toBe('Test Task')
    expect(result.data?.createTask.taskEdge.node.id).toBeDefined()
    expect(result.data?.createTask.taskEdge.node.icon).toBeNull()
  })

  it('can create a task with an icon', async () => {
    const { userToken } = await createTestUser()
    const result = await createTask({
      title: 'Task with icon',
      icon: 'check-circle',
      yoga,
      userToken,
    })

    expect(result.data?.createTask.taskEdge.node.title).toBe('Task with icon')
    expect(result.data?.createTask.taskEdge.node.icon).toBe('check-circle')
  })

  it('can update a task that is created for a user via the updateTask mutation', async () => {
    const { userToken } = await createTestUser()
    const firstResult = await createTask({
      title: 'Another test task',
      yoga,
      userToken,
    })

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

  it('can update a task icon via the updateTask mutation', async () => {
    const { userToken } = await createTestUser()
    const createResult = await createTask({
      title: 'Task to update icon',
      yoga,
      userToken,
    })

    expect(createResult.data?.createTask.taskEdge.node.icon).toBeNull()

    const updateResult = await executeGraphQL(
      graphql(`
        mutation UpdateTaskIcon($input: UpdateTaskInput!) {
          updateTask(input: $input) {
            task {
              id
              title
              icon
            }
          }
        }
      `),
      {
        input: {
          taskId: createResult.data!.createTask.taskEdge.node.id,
          icon: 'star',
        },
      },
      { yoga, userToken },
    )

    expect(updateResult.data?.updateTask.task.icon).toBe('star')
    expect(updateResult.data?.updateTask.task.title).toBe('Task to update icon')
  })

  it('can delete a task that is created for a user via the deleteTask mutation', async () => {
    const { userToken } = await createTestUser()
    const createResult = await createTask({
      title: 'Task to delete',
      yoga,
      userToken,
    })

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
    const createResult = await createTask({
      title: 'Task to select',
      yoga,
      userToken,
    })
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
        createTask({
          title: `Task to select ${i + 1}`,
          yoga,
          userToken,
        }),
      ),
    )

    // ensure they're created correctly
    created.map(res => expect(res.errors).toBeUndefined())

    const selectPage = graphql(`
      query PaginatedTasks($after: String) {
        tasks(first: 10, after: $after) {
          edges {
            node {
              id
              title
            }
          }
          pageInfo {
            hasNextPage
            endCursor
            startCursor
          }
        }
      }
    `)

    // now select the first page
    const selected = await executeGraphQL(selectPage, {}, { yoga, userToken })
    expect(selected.data?.tasks.edges.length).toEqual(10)
    expect(selected.data?.tasks.pageInfo.hasNextPage).toBe(true)

    assert(selected.data?.tasks.edges !== undefined, 'an edge set exists')
    for (const [index] of selected.data.tasks.edges.entries()) {
      expect(selected.data.tasks.edges[index].node.title).toEqual(
        `Task to select ${index + 1}`,
      )
    }

    const nextPage = await executeGraphQL(
      selectPage,
      { after: selected.data?.tasks.pageInfo.endCursor },
      { yoga, userToken },
    )
    expect(nextPage.data?.tasks.edges.length).toEqual(10)
    expect(nextPage.data?.tasks.pageInfo.hasNextPage).toBe(true)
    assert(nextPage.data?.tasks.edges !== undefined, 'an edge set exists')
    for (const [index] of nextPage.data.tasks.edges.entries()) {
      expect(nextPage.data.tasks.edges[index].node.title).toEqual(
        `Task to select ${index + 11}`,
      )
    }

    const finalPage = await executeGraphQL(
      selectPage,
      { after: nextPage.data?.tasks.pageInfo.endCursor },
      { yoga, userToken },
    )
    expect(finalPage.data?.tasks.edges.length).toEqual(1)
    expect(finalPage.data?.tasks.pageInfo.hasNextPage).toBe(false)
    expect(finalPage.data?.tasks.edges[0].node.title).toEqual(
      'Task to select 21',
    )
  })

  it('can filter tasks by title using titleSearch', async () => {
    const { userToken } = await createTestUser()

    await Promise.all([
      createTask({ title: 'Morning meditation', yoga, userToken }),
      createTask({ title: 'Evening meditation', yoga, userToken }),
      createTask({ title: 'Take vitamins', yoga, userToken }),
      createTask({ title: 'Read a book', yoga, userToken }),
    ])

    const searchResult = await executeGraphQL(
      graphql(`
        query TasksTitleSearch($titleSearch: String) {
          tasks(first: 10, titleSearch: $titleSearch) {
            edges {
              node {
                title
              }
            }
          }
        }
      `),
      { titleSearch: 'meditation' },
      { yoga, userToken },
    )

    expect(searchResult.errors).toBeUndefined()
    expect(searchResult.data?.tasks.edges.length).toEqual(2)
    expect(searchResult.data?.tasks.edges.map(e => e.node.title)).toEqual(
      expect.arrayContaining(['Morning meditation', 'Evening meditation']),
    )
  })

  it('titleSearch is case-insensitive', async () => {
    const { userToken } = await createTestUser()

    await createTask({ title: 'Morning Meditation', yoga, userToken })

    const searchResult = await executeGraphQL(
      graphql(`
        query TasksTitleSearchCaseInsensitive($titleSearch: String) {
          tasks(first: 10, titleSearch: $titleSearch) {
            edges {
              node {
                title
              }
            }
          }
        }
      `),
      { titleSearch: 'MEDITATION' },
      { yoga, userToken },
    )

    expect(searchResult.errors).toBeUndefined()
    expect(searchResult.data?.tasks.edges.length).toEqual(1)
    expect(searchResult.data?.tasks.edges[0].node.title).toEqual(
      'Morning Meditation',
    )
  })

  it('returns all tasks when titleSearch is not provided', async () => {
    const { userToken } = await createTestUser()

    await Promise.all([
      createTask({ title: 'Task A', yoga, userToken }),
      createTask({ title: 'Task B', yoga, userToken }),
    ])

    const searchResult = await executeGraphQL(
      graphql(`
        query TasksNoTitleSearch {
          tasks(first: 10) {
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

    expect(searchResult.errors).toBeUndefined()
    expect(searchResult.data?.tasks.edges.length).toEqual(2)
  })
})
