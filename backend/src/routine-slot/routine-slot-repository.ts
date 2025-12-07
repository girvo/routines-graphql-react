import type { Kysely, ExpressionBuilder } from 'kysely'
import type { Database, DayOfWeek, DaySection } from '../database/types.ts'
import type { PaginationArgs } from '../graphql/types.ts'
import { createCursorCodec } from '../graphql/cursor.ts'
import { format } from 'date-fns'

export interface RoutineSlotRow {
  id: number
  user_id: number
  task_id: number
  day_of_week: DayOfWeek
  section: DaySection
  created_at: string
  deleted_at: string | null
}

export interface RoutineSlotCursor {
  createdAt: string
  id: number
}

export const routineSlotCursor = createCursorCodec<RoutineSlotCursor>()

const buildCursorCondition = (
  eb: ExpressionBuilder<Database, 'routine_slots'>,
  cursor: { created_at: string; id: number },
) => {
  return eb.or([
    eb('created_at', '>', cursor.created_at),
    eb.and([
      eb('created_at', '=', cursor.created_at),
      eb('id', '>', cursor.id),
    ]),
  ])
}

export const createRoutineSlotRepository = (db: Kysely<Database>) => {
  return {
    async createRoutineSlot(
      userId: number,
      taskId: number,
      dayOfWeek: DayOfWeek,
      section: DaySection,
    ): Promise<RoutineSlotRow> {
      return db
        .insertInto('routine_slots')
        .values({
          user_id: userId,
          task_id: taskId,
          day_of_week: dayOfWeek,
          section: section,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async deleteRoutineSlot(id: number, userId: number): Promise<void> {
      await db
        .updateTable('routine_slots')
        .set({ deleted_at: new Date().toISOString() })
        .where('id', '=', id)
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .execute()
    },

    async findByIdAndUserId(
      id: number,
      userId: number,
    ): Promise<RoutineSlotRow | undefined> {
      return db
        .selectFrom('routine_slots')
        .selectAll()
        .where('id', '=', id)
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .executeTakeFirst()
    },

    async findAllByIdsAndUserId(
      ids: readonly number[],
      userId: number,
    ): Promise<RoutineSlotRow[]> {
      return db
        .selectFrom('routine_slots')
        .selectAll()
        .where('id', 'in', ids)
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .execute()
    },

    async findAllByTaskIdAndUserIdPaginated(
      taskId: number,
      userId: number,
      pagination: PaginationArgs,
    ): Promise<RoutineSlotRow[]> {
      let query = db
        .selectFrom('routine_slots')
        .selectAll()
        .where('task_id', '=', taskId)
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .orderBy('created_at', 'asc')
        .orderBy('id', 'asc')
        .limit(pagination.first + 1)

      if (pagination.after) {
        const cursor = routineSlotCursor.decode(pagination.after)
        const sqliteFormattedDate = format(
          new Date(cursor.createdAt),
          'yyyy-MM-dd HH:mm:ss',
        )
        query = query.where(eb =>
          buildCursorCondition(eb, {
            created_at: sqliteFormattedDate,
            id: cursor.id,
          }),
        )
      }

      return query.execute()
    },
  }
}
