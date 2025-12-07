import type { Kysely } from 'kysely'
import type { Database, DayOfWeek, DaySection } from '../database/types.ts'
import { createCursorCodec } from '../graphql/cursor.ts'

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
  }
}
