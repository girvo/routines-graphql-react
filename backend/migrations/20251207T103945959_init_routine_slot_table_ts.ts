/**
 * Migration: init_routine_slot_table.ts
 * Created: 2025-12-07T00:39:45.960Z
 */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('routine_slots')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('task_id', 'integer', col =>
      col.notNull().references('tasks.id').onDelete('cascade'),
    )
    .addColumn('day_of_week', 'varchar', col =>
      col
        .notNull()
        .check(
          sql`day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')`,
        ),
    )
    .addColumn('section', 'varchar', col =>
      col.notNull().check(sql`section IN ('MORNING', 'MIDDAY', 'EVENING')`),
    )
    .addColumn('created_at', 'datetime', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('deleted_at', 'datetime')
    .execute()

  await db.schema
    .createIndex('idx_routine_slots_user_id')
    .on('routine_slots')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_routine_slots_task_id')
    .on('routine_slots')
    .column('task_id')
    .execute()

  await db.schema
    .createIndex('idx_routine_slots_day_section')
    .on('routine_slots')
    .columns(['day_of_week', 'section'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('routine_slots').execute()
}
