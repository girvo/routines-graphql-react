import type { Kysely, ExpressionBuilder, DeleteResult } from 'kysely'
import type { Database } from '../database/types.ts'
import type { PaginationArgs } from '../graphql/types.ts'
import { createCursorCodec } from '../graphql/cursor.ts'
import { format, startOfDay, endOfDay } from 'date-fns'
import { getCurrentTimestamp } from '../database/time.ts'

export interface TaskCompletionRow {
  id: number
  user_id: number
  routine_slot_id: number
  completed_at: string
  created_at: string
}

export interface TaskCompletionCursor {
  completedAt: string
  id: number
}

export const taskCompletionCursor = createCursorCodec<TaskCompletionCursor>()

const buildCursorCondition = (
  eb: ExpressionBuilder<Database, 'task_completions'>,
  cursor: { completed_at: string; id: number },
) => {
  return eb.or([
    eb('completed_at', '>', cursor.completed_at),
    eb.and([
      eb('completed_at', '=', cursor.completed_at),
      eb('id', '>', cursor.id),
    ]),
  ])
}

export const createTaskCompletionRepository = (db: Kysely<Database>) => {
  return {
    async findByIdAndUserId(
      id: number,
      userId: number,
    ): Promise<TaskCompletionRow | undefined> {
      return db
        .selectFrom('task_completions')
        .selectAll()
        .where('id', '=', id)
        .where('user_id', '=', userId)
        .executeTakeFirst()
    },

    async findAllByIdsAndUserId(
      ids: readonly number[],
      userId: number,
    ): Promise<TaskCompletionRow[]> {
      return db
        .selectFrom('task_completions')
        .selectAll()
        .where('id', 'in', ids)
        .where('user_id', '=', userId)
        .execute()
    },

    async findByUserIdPaginated(
      userId: number,
      pagination: PaginationArgs,
      dateRange?: { startDate?: Date; endDate?: Date },
    ): Promise<TaskCompletionRow[]> {
      let query = db
        .selectFrom('task_completions')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('completed_at', 'asc')
        .orderBy('id', 'asc')
        .limit(pagination.first + 1)

      if (dateRange?.startDate) {
        query = query.where(
          'completed_at',
          '>=',
          dateRange.startDate.toISOString(),
        )
      }

      if (dateRange?.endDate) {
        query = query.where(
          'completed_at',
          '<=',
          dateRange.endDate.toISOString(),
        )
      }

      if (pagination.after) {
        const cursor = taskCompletionCursor.decode(pagination.after)
        const sqliteFormattedDate = format(
          new Date(cursor.completedAt),
          'yyyy-MM-dd HH:mm:ss.SSS',
        )
        query = query.where(eb =>
          buildCursorCondition(eb, {
            completed_at: sqliteFormattedDate,
            id: cursor.id,
          }),
        )
      }

      return query.execute()
    },

    async findByRoutineSlotIdPaginated(
      routineSlotId: number,
      userId: number,
      pagination: PaginationArgs,
      dateRange?: { startDate?: Date; endDate?: Date },
    ): Promise<TaskCompletionRow[]> {
      let query = db
        .selectFrom('task_completions')
        .selectAll()
        .where('routine_slot_id', '=', routineSlotId)
        .where('user_id', '=', userId)
        .orderBy('completed_at', 'asc')
        .orderBy('id', 'asc')
        .limit(pagination.first + 1)

      if (dateRange?.startDate) {
        query = query.where(
          'completed_at',
          '>=',
          dateRange.startDate.toISOString(),
        )
      }

      if (dateRange?.endDate) {
        query = query.where(
          'completed_at',
          '<=',
          dateRange.endDate.toISOString(),
        )
      }

      if (pagination.after) {
        const cursor = taskCompletionCursor.decode(pagination.after)
        const sqliteFormattedDate = format(
          new Date(cursor.completedAt),
          'yyyy-MM-dd HH:mm:ss.SSS',
        )
        query = query.where(eb =>
          buildCursorCondition(eb, {
            completed_at: sqliteFormattedDate,
            id: cursor.id,
          }),
        )
      }

      return query.execute()
    },

    async createCompletion(
      userId: number,
      routineSlotId: number,
    ): Promise<TaskCompletionRow> {
      return db
        .insertInto('task_completions')
        .values({
          user_id: userId,
          routine_slot_id: routineSlotId,
          completed_at: getCurrentTimestamp(),
          created_at: getCurrentTimestamp(),
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async deleteCompletionBySlotAndDate(
      routineSlotId: number,
      userId: number,
      completionDate: Date,
    ): Promise<DeleteResult> {
      const startOfDay = new Date(completionDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(completionDate)
      endOfDay.setHours(23, 59, 59, 999)

      return db
        .deleteFrom('task_completions')
        .where('routine_slot_id', '=', routineSlotId)
        .where('user_id', '=', userId)
        .where('completed_at', '>=', startOfDay.toISOString())
        .where('completed_at', '<=', endOfDay.toISOString())
        .executeTakeFirstOrThrow()
    },

    async deleteCompletion(
      taskCompletionId: number,
      userId: number,
    ): Promise<DeleteResult> {
      return db
        .deleteFrom('task_completions')
        .where('id', '=', taskCompletionId)
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()
    },

    async findByTaskIdPaginated(
      taskId: number,
      userId: number,
      pagination: PaginationArgs,
      dateRange?: { startDate?: Date; endDate?: Date },
    ): Promise<TaskCompletionRow[]> {
      let query = db
        .selectFrom('task_completions')
        .innerJoin(
          'routine_slots',
          'task_completions.routine_slot_id',
          'routine_slots.id',
        )
        .selectAll('task_completions')
        .where('routine_slots.task_id', '=', taskId)
        .where('task_completions.user_id', '=', userId)
        .where('routine_slots.deleted_at', 'is', null)
        .orderBy('task_completions.completed_at', 'asc')
        .orderBy('task_completions.id', 'asc')
        .limit(pagination.first + 1)

      if (dateRange?.startDate) {
        query = query.where(
          'task_completions.completed_at',
          '>=',
          dateRange.startDate.toISOString(),
        )
      }

      if (dateRange?.endDate) {
        query = query.where(
          'task_completions.completed_at',
          '<=',
          dateRange.endDate.toISOString(),
        )
      }

      if (pagination.after) {
        const cursor = taskCompletionCursor.decode(pagination.after)
        const sqliteFormattedDate = format(
          new Date(cursor.completedAt),
          'yyyy-MM-dd HH:mm:ss.SSS',
        )
        query = query.where(eb =>
          buildCursorCondition(eb, {
            completed_at: sqliteFormattedDate,
            id: cursor.id,
          }),
        )
      }

      return query.execute()
    },
  }
}
