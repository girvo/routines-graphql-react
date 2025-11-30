import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Kysely } from 'kysely'
import type { Database } from '../../src/database/types.ts'
import { createTestDb, destroyTestDb } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTestApp, executeGraphQL } from '../helpers/graphql.ts'
import type { createApp } from '../../src/main.ts'

describe('Task operations', () => {
  let db: Kysely<Database>
  let yoga: Awaited<ReturnType<typeof createApp>>['yoga']

  beforeEach(async () => {
    db = await createTestDb()
    const { yoga: testYoga } = await createTestApp(db)
    yoga = testYoga
  })

  afterEach(async () => {
    await destroyTestDb(db)
  })

  it('can create a new task for a user via createTask mutation', async () => {
    const token = await createTestUser(db)
    const result = await executeGraphQL(
      yoga,
      `
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
      `,
      {
        title: 'Test Task',
      },
      token,
    )

    expect(result.data?.createTask.taskEdge.node.title).toBe('Test Task')
    expect(result.data?.createTask.taskEdge.node.id).toBeDefined()
  })
})
