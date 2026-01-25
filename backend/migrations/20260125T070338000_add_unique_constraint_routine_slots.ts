/**
 * Migration: add_unique_constraint_routine_slots
 * Created: 2026-01-25
 *
 * Adds a unique constraint on (user_id, task_id, day_of_week, section) to prevent
 * the same task from being added to the same day/section combination twice.
 */
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idx_routine_slots_unique_task_day_section')
    .on('routine_slots')
    .columns(['user_id', 'task_id', 'day_of_week', 'section'])
    .unique()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_routine_slots_unique_task_day_section')
    .execute()
}
