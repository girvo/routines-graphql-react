/**
 * Migration: add_icon_col_to_tasks_table
 * Created: 2025-12-13T11:38:45.405Z
 */
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('tasks')
    .addColumn('icon', 'varchar')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('tasks')
    .dropColumn('icon')
    .execute()
}
