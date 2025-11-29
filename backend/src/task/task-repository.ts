import type { Kysely, ExpressionBuilder } from 'kysely'
import type { Database } from '../database/types.ts'
import type { PaginationArgs } from '../graphql/types.ts'
import { createCursorCodec } from '../graphql/cursor.ts'

export interface TaskRow {
  id: number
  user_id: number
  title: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface TaskCursor {
  createdAt: string
  id: number
}

export const taskCursor = createCursorCodec<TaskCursor>()

// Needed for building the cursor
const buildCursorCondition = (
  eb: ExpressionBuilder<Database, 'tasks'>,
  cursor: { created_at: string; id: number },
) => {
  return eb.or([
    eb('created_at', '<', cursor.created_at),
    eb.and([
      eb('created_at', '=', cursor.created_at),
      eb('id', '<', cursor.id), // yes we're being lazy and abusing ID being a number
    ]),
  ])
}

export const createTaskRepository = (db: Kysely<Database>) => {
  return {
    async findByIdAndUserId(
      id: number,
      userId: number,
    ): Promise<TaskRow | undefined> {
      console.debug(`Looking for task with id ${id} for user ${userId}`)
      return db
        .selectFrom('tasks')
        .selectAll()
        .where('id', '=', id)
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .executeTakeFirst()
    },

    async findAllByIdsAndUserId(
      ids: readonly number[],
      userId: number,
    ): Promise<TaskRow[]> {
      return db
        .selectFrom('tasks')
        .selectAll()
        .where('id', 'in', ids)
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .execute()
    },

    async findByUserIdPaginated(
      userId: number,
      pagination: PaginationArgs,
    ): Promise<TaskRow[]> {
      let query = db
        .selectFrom('tasks')
        .selectAll()
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .orderBy('created_at', 'desc')
        .limit(pagination.first + 1) // always one more for hasNextPage

      if (pagination.after) {
        const cursor = taskCursor.decode(pagination.after)
        query = query.where(eb =>
          buildCursorCondition(eb, {
            created_at: cursor.createdAt,
            id: cursor.id,
          }),
        )
      }

      return query.execute()
    },

    async createTask(userId: number, title: string): Promise<TaskRow> {
      return db
        .insertInto('tasks')
        .values({
          user_id: userId,
          title: title,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async updateTask(id: number, title: string): Promise<TaskRow> {
      return db
        .updateTable('tasks')
        .set({
          title: title,
          updated_at: new Date().toISOString(),
        })
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async deleteTask(id: number): Promise<void> {
      await db
        .updateTable('tasks')
        .set({ deleted_at: new Date().toISOString() })
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .execute()
    },
  }
}
