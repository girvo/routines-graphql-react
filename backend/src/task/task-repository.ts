import type { Kysely, ExpressionBuilder, UpdateObject } from 'kysely'
import type { Database } from '../database/types.ts'
import type { PaginationArgs } from '../graphql/types.ts'
import { createCursorCodec } from '../graphql/cursor.ts'
import { format } from 'date-fns'
import { getCurrentTimestamp } from '../database/time.ts'

export interface TaskRow {
  id: number
  user_id: number
  title: string
  icon: string | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface TaskCursor {
  createdAt: string
  id: number
  direction: 'asc' | 'desc'
}

export const taskCursor = createCursorCodec<TaskCursor>()

const buildCursorCondition = (
  eb: ExpressionBuilder<Database, 'tasks'>,
  cursor: { created_at: string; id: number; direction: 'asc' | 'desc' },
) => {
  const createdAtOperator = cursor.direction === 'asc' ? '>' : '<'

  return eb.or([
    eb('created_at', createdAtOperator, cursor.created_at),
    eb.and([
      eb('created_at', '=', cursor.created_at),
      eb('id', '>', cursor.id),
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
      const direction: 'asc' | 'desc' = pagination.after
        ? taskCursor.decode(pagination.after).direction
        : 'asc'

      let query = db
        .selectFrom('tasks')
        .selectAll()
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .orderBy('created_at', direction)
        .orderBy('id', 'asc')
        .limit(pagination.first + 1)

      if (pagination.after) {
        const cursor = taskCursor.decode(pagination.after)
        const sqliteFormattedDate = format(
          new Date(cursor.createdAt),
          'yyyy-MM-dd HH:mm:ss.SSS',
        )
        query = query.where(eb =>
          buildCursorCondition(eb, {
            created_at: sqliteFormattedDate,
            id: cursor.id,
            direction: cursor.direction,
          }),
        )
      }

      return query.execute()
    },

    async createTask(
      title: string,
      userId: number,
      icon?: string | null,
    ): Promise<TaskRow> {
      return db
        .insertInto('tasks')
        .values({
          user_id: userId,
          title: title,
          icon: icon ?? null,
          created_at: getCurrentTimestamp(),
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async updateTask(
      id: number,
      userId: number,
      updates: { title?: string | null; icon?: string | null },
    ): Promise<TaskRow> {
      const setValues: UpdateObject<Database, 'tasks', 'tasks'> = {
        updated_at: getCurrentTimestamp(),
      }
      if (updates.title !== undefined && updates.title !== null) {
        setValues.title = updates.title
      }
      if (updates.icon !== undefined) {
        setValues.icon = updates.icon
      }

      return db
        .updateTable('tasks')
        .set(setValues)
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async deleteTask(id: number): Promise<void> {
      await db
        .updateTable('tasks')
        .set({ deleted_at: getCurrentTimestamp() })
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .execute()
    },
  }
}
