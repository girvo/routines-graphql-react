/**
 * Migration: init_push_reminder_tables
 * Created: 2026-09-16
 *
 * `push_subscriptions` stores the Web Push endpoints handed out by browser push
 * services (APNs for the installed iOS PWA, plus any desktop browser). The
 * endpoint is unique because iOS hands out a stable endpoint per install, so
 * re-enabling reminders must update the existing row instead of duplicating it.
 *
 * `morning_reminder_deliveries` is the idempotency ledger for the once-daily
 * morning reminder: the unique `(user_id, day_key)` pair guarantees a day is
 * only ever evaluated once, whatever else races with the scheduler.
 */
import { Kysely, sql } from 'kysely'

const ISO_DEFAULT = sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('push_subscriptions')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('endpoint', 'text', col => col.notNull())
    .addColumn('p256dh_key', 'text', col => col.notNull())
    .addColumn('auth_key', 'text', col => col.notNull())
    .addColumn('platform', 'text')
    .addColumn('user_agent', 'text')
    .addColumn('created_at', 'text', col => col.defaultTo(ISO_DEFAULT).notNull())
    .addColumn('last_seen_at', 'text')
    .execute()

  await db.schema
    .createIndex('idx_push_subscriptions_endpoint')
    .on('push_subscriptions')
    .column('endpoint')
    .unique()
    .execute()

  await db.schema
    .createIndex('idx_push_subscriptions_user_id')
    .on('push_subscriptions')
    .column('user_id')
    .execute()

  await db.schema
    .createTable('morning_reminder_deliveries')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('day_key', 'text', col => col.notNull())
    .addColumn('status', 'text', col => col.notNull())
    .addColumn('subscriptions_sent', 'integer', col =>
      col.notNull().defaultTo(0),
    )
    .addColumn('error', 'text')
    .addColumn('created_at', 'text', col => col.defaultTo(ISO_DEFAULT).notNull())
    .execute()

  await db.schema
    .createIndex('idx_morning_reminder_deliveries_user_day')
    .on('morning_reminder_deliveries')
    .columns(['user_id', 'day_key'])
    .unique()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('morning_reminder_deliveries').execute()
  await db.schema.dropTable('push_subscriptions').execute()
}
