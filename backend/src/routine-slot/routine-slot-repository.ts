import type { Kysely, ExpressionBuilder } from 'kysely'
import { sql } from 'kysely'
import type { Database, DayOfWeek, DaySection } from '../database/types.ts'
import type { PaginationArgs } from '../graphql/types.ts'
import { createCursorCodec } from '../graphql/cursor.ts'
import { getCurrentTimestamp } from '../database/time.ts'

export interface RoutineSlotRow {
  id: number
  user_id: number
  task_id: number
  day_of_week: DayOfWeek
  section: DaySection
  position: number
  created_at: string
  deleted_at: string | null
}

export interface RoutineSlotCursor {
  createdAt: string
  id: number
}

export const routineSlotCursor = createCursorCodec<RoutineSlotCursor>()

export interface RoutineSlotPositionCursor {
  position: number
  id: number
}

export const routineSlotPositionCursor =
  createCursorCodec<RoutineSlotPositionCursor>()

export interface RoutineSlotPositionEntry {
  id: number
  position: number
}

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

const routineSlotFunctions = (db: Kysely<Database>) => {
  return {
    async insertWithPosition(
      userId: number,
      taskId: number,
      dayOfWeek: DayOfWeek,
      section: DaySection,
      position: number,
    ): Promise<RoutineSlotRow> {
      return db
        .insertInto('routine_slots')
        .values({
          user_id: userId,
          task_id: taskId,
          day_of_week: dayOfWeek,
          section: section,
          position: position,
          created_at: getCurrentTimestamp(),
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async findByUniqueKey(
      userId: number,
      taskId: number,
      dayOfWeek: DayOfWeek,
      section: DaySection,
    ): Promise<RoutineSlotRow | undefined> {
      return db
        .selectFrom('routine_slots')
        .selectAll()
        .where('user_id', '=', userId)
        .where('task_id', '=', taskId)
        .where('day_of_week', '=', dayOfWeek)
        .where('section', '=', section)
        .executeTakeFirst()
    },

    // A deleted row keeps the position it had, which another live row may
    // already use by the time it is revived, so the caller passes a new one.
    async reviveRoutineSlotWithPosition(
      id: number,
      position: number,
    ): Promise<RoutineSlotRow> {
      return db
        .updateTable('routine_slots')
        .set({ deleted_at: null, position: position })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async listByDayAndSection(
      userId: number,
      dayOfWeek: DayOfWeek,
      section: DaySection,
    ): Promise<RoutineSlotRow[]> {
      return db
        .selectFrom('routine_slots')
        .selectAll()
        .where('user_id', '=', userId)
        .where('day_of_week', '=', dayOfWeek)
        .where('section', '=', section)
        .where('deleted_at', 'is', null)
        .orderBy('position', 'asc')
        .orderBy('id', 'asc')
        .execute()
    },

    async nextPositionForDayAndSection(
      userId: number,
      dayOfWeek: DayOfWeek,
      section: DaySection,
    ): Promise<number> {
      const row = await db
        .selectFrom('routine_slots')
        .select(sql<number | null>`max(position)`.as('max_position'))
        .where('user_id', '=', userId)
        .where('day_of_week', '=', dayOfWeek)
        .where('section', '=', section)
        .where('deleted_at', 'is', null)
        .executeTakeFirst()

      return (row?.max_position ?? -1) + 1
    },

    async setPositions(entries: readonly RoutineSlotPositionEntry[]) {
      for (const entry of entries) {
        await db
          .updateTable('routine_slots')
          .set({ position: entry.position })
          .where('id', '=', entry.id)
          .execute()
      }
    },

    async deleteRoutineSlot(id: number, userId: number) {
      return db
        .updateTable('routine_slots')
        .set({ deleted_at: getCurrentTimestamp() })
        .where('id', '=', id)
        .where('user_id', '=', userId)
        .where('deleted_at', 'is', null)
        .executeTakeFirstOrThrow()
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
        query = query.where(eb =>
          buildCursorCondition(eb, {
            created_at: cursor.createdAt,
            id: cursor.id,
          }),
        )
      }

      return query.execute()
    },

    async findAllByDayAndSectionPaginated(
      userId: number,
      dayOfWeek: DayOfWeek,
      section: DaySection,
      pagination: PaginationArgs,
    ): Promise<RoutineSlotRow[]> {
      let query = db
        .selectFrom('routine_slots')
        .selectAll()
        .where('user_id', '=', userId)
        .where('day_of_week', '=', dayOfWeek)
        .where('section', '=', section)
        .where('deleted_at', 'is', null)
        .orderBy('position', 'asc')
        .orderBy('id', 'asc')
        .limit(pagination.first + 1)

      if (pagination.after) {
        const cursor = routineSlotPositionCursor.decode(pagination.after)
        query = query.where(eb =>
          eb.or([
            eb('position', '>', cursor.position),
            eb.and([
              eb('position', '=', cursor.position),
              eb('id', '>', cursor.id),
            ]),
          ]),
        )
      }

      return query.execute()
    },
  }
}

// No transaction() on this handle: Kysely does not allow nested transactions.
export type RoutineSlotTransaction = ReturnType<typeof routineSlotFunctions>

// Reordering one slot can move others, so multi-row position writes share a transaction.
export type RoutineSlotRepository = RoutineSlotTransaction & {
  transaction<T>(fn: (tx: RoutineSlotTransaction) => Promise<T>): Promise<T>
}

export const createRoutineSlotRepository = (
  db: Kysely<Database>,
): RoutineSlotRepository => {
  return {
    ...routineSlotFunctions(db),
    transaction<T>(fn: (tx: RoutineSlotTransaction) => Promise<T>): Promise<T> {
      return db.transaction().execute(tx => fn(createRoutineSlotRepository(tx)))
    },
  }
}
