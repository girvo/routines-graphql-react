/**
 * Migration: add_name_col_to_users_table
 * Created: 2026-04-25T03:37:55.467Z
 */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('name', 'varchar', (col) => col.notNull().defaultTo(''))
    .execute()

  await sql`UPDATE users SET name = email WHERE name = ''`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('name').execute()
}
