/**
 * Migration: init_users_table
 * Created: 2025-11-03T10:35:59.383Z
 */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('email', 'varchar', col => col.notNull().unique())
    .addColumn('password_hash', 'varchar', col => col.notNull())
    .addColumn('created_at', 'datetime', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('last_logged_in', 'datetime')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
}
