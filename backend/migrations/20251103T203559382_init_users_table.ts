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
    .addColumn('updated_at', 'datetime', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('last_logged_in', 'datetime')
    .execute()

  await db.schema
    .createTable('refresh_tokens')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('token_hash', 'varchar', col => col.notNull().unique())
    .addColumn('expires_at', 'datetime', col => col.notNull())
    .addColumn('created_at', 'datetime', col =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('revoked_at', 'datetime')
    .addColumn('user_agent', 'varchar')
    .addColumn('ip_address', 'varchar')
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_user_id')
    .on('refresh_tokens')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_token_hash')
    .on('refresh_tokens')
    .column('token_hash')
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_expires_at')
    .on('refresh_tokens')
    .column('expires_at')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('refresh_tokens').execute()
  await db.schema.dropTable('users').execute()
}
