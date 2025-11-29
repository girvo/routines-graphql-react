/**
 * Migration: init_tasks_table
 * Created: 2025-11-29T09:24:52.221Z
 */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('tasks')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('title', 'varchar', col => col.notNull())
    .addColumn('created_at', 'datetime', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'datetime', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('deleted_at', 'datetime')
    .execute()

  await db.schema
    .createIndex('idx_tasks_user_id')
    .on('tasks')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_tasks_deleted_at')
    .on('tasks')
    .column('deleted_at')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('tasks').execute()
}
