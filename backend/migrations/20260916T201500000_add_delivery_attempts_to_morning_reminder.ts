/**
 * Migration: add_delivery_attempts_to_morning_reminder_deliveries
 * Created: 2026-09-16
 *
 * A `FAILED` delivery used to be final: the once-daily evaluation had no retry,
 * so one transient push-service 5xx cost the user that day's reminder and the
 * only recovery was deleting the row by hand. `FAILED` is now retryable, and
 * `attempts` is what stops a permanently broken push service from being retried
 * forever.
 *
 * `PENDING` is a new value of the existing `status` text column: the row is now
 * written *before* the sends start (claim-then-send) so two overlapping runs
 * cannot both deliver the same day.
 */
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('morning_reminder_deliveries')
    .addColumn('attempts', 'integer', col => col.notNull().defaultTo(0))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('morning_reminder_deliveries')
    .dropColumn('attempts')
    .execute()
}
