import type { Kysely } from 'kysely'
import type { Database } from '../database/types.ts'

export interface TaskRow {
  id: number
  user_id: number
  title: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
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

    async findByUserId(userId: number): Promise<TaskRow[]> {
      return db
        .selectFrom('tasks')
        .selectAll()
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .orderBy('created_at', 'desc')
        .execute()
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
