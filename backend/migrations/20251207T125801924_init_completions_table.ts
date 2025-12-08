/**
 * Migration: init_completions_table
 * Created: 2025-12-07T02:58:01.925Z
 */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('task_completions')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('routine_slot_id', 'integer', col =>
      col.notNull().references('routine_slots.id').onDelete('cascade'),
    )
    .addColumn('completed_at', 'datetime', col =>
      col.defaultTo(sql`(strftime('%Y-%m-%d %H:%M:%f', 'now'))`).notNull(),
    )
    .addColumn('created_at', 'datetime', col =>
      col.defaultTo(sql`(strftime('%Y-%m-%d %H:%M:%f', 'now'))`).notNull(),
    )
    .execute()

  // Ensure one completion per slot per day
  await sql`
    CREATE UNIQUE INDEX unique_routine_slot_completion_per_day
    ON task_completions(routine_slot_id, DATE(completed_at))
  `.execute(db)

  // User's completions
  await db.schema
    .createIndex('idx_task_completions_user_completed_at')
    .on('task_completions')
    .columns(['user_id', 'completed_at'])
    .execute()

  // For Task.completions() and routine slot lookups
  await db.schema
    .createIndex('idx_task_completions_routine_slot_completed_at')
    .on('task_completions')
    .columns(['routine_slot_id', 'completed_at'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('task_completions').execute()
}
