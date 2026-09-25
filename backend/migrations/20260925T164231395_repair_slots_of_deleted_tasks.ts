/**
 * Migration: repair_slots_of_deleted_tasks
 * Created: 2026-09-25T06:42:31.395Z
 *
 * `deleteTask` used to soft-delete only the task, leaving its routine slots
 * live. `RoutineSlot.task` then threw for those orphans, and because the field
 * is non-null the error nulled the whole day-section or daily-routine result.
 *
 * This soft-deletes each orphan with its task's own deletion time, then
 * re-densifies `position` to `0..n-1` in every affected
 * (user_id, day_of_week, section) scope, which is what `deleteRoutineSlot`
 * maintains for live rows.
 *
 * `down` is a no-op: once repaired, which slots were orphans is not
 * recoverable, and restoring them would reintroduce the failure.
 */
import { Kysely } from 'kysely'

interface OrphanRow {
  id: number
  user_id: number
  day_of_week: string
  section: string
  task_deleted_at: string
}

export async function up(db: Kysely<any>): Promise<void> {
  const orphans = (await db
    .selectFrom('routine_slots')
    .innerJoin('tasks', 'tasks.id', 'routine_slots.task_id')
    .select([
      'routine_slots.id as id',
      'routine_slots.user_id as user_id',
      'routine_slots.day_of_week as day_of_week',
      'routine_slots.section as section',
      'tasks.deleted_at as task_deleted_at',
    ])
    .where('routine_slots.deleted_at', 'is', null)
    .where('tasks.deleted_at', 'is not', null)
    .execute()) as OrphanRow[]

  const scopes = new Map<string, Omit<OrphanRow, 'id' | 'task_deleted_at'>>()

  for (const orphan of orphans) {
    await db
      .updateTable('routine_slots')
      .set({ deleted_at: orphan.task_deleted_at })
      .where('id', '=', orphan.id)
      .execute()
    scopes.set(`${orphan.user_id}|${orphan.day_of_week}|${orphan.section}`, {
      user_id: orphan.user_id,
      day_of_week: orphan.day_of_week,
      section: orphan.section,
    })
  }

  for (const scope of scopes.values()) {
    const live = (await db
      .selectFrom('routine_slots')
      .select(['id', 'position'])
      .where('user_id', '=', scope.user_id)
      .where('day_of_week', '=', scope.day_of_week)
      .where('section', '=', scope.section)
      .where('deleted_at', 'is', null)
      .orderBy('position')
      .orderBy('id')
      .execute()) as { id: number; position: number }[]

    for (const [position, row] of live.entries()) {
      if (row.position === position) continue
      await db
        .updateTable('routine_slots')
        .set({ position })
        .where('id', '=', row.id)
        .execute()
    }
  }
}

export async function down(): Promise<void> {}
