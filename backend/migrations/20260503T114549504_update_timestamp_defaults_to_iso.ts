/**
 * Migration: update_timestamp_defaults_to_iso
 * Created: 2026-05-03T01:45:49.505Z
 *
 * Rewrites every column DEFAULT that calls
 * `strftime('%Y-%m-%d %H:%M:%f', 'now')` to use
 * `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')` instead, so default-fired inserts
 * (e.g. omitting `updated_at` on user/task creation) produce the same ISO 8601
 * UTC format that the application now writes via `Date.toISOString()`.
 *
 * SQLite has no `ALTER COLUMN ... SET DEFAULT`. The supported options are
 * recreating each table or temporarily enabling `PRAGMA writable_schema` and
 * editing `sqlite_master` in place. The latter is documented for exactly this
 * kind of metadata-only change
 * (https://www.sqlite.org/lang_altertable.html#otheralter) and is far less
 * invasive than dropping/recreating five tables with their indexes and FKs.
 * `PRAGMA integrity_check` afterwards confirms the rewrite didn't corrupt the
 * schema.
 */
import { Kysely, sql } from 'kysely'

const OLD_FORMAT = "strftime('%Y-%m-%d %H:%M:%f', 'now')"
const NEW_FORMAT = "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`PRAGMA writable_schema = 1`.execute(db)
  await sql`
    UPDATE sqlite_master
    SET sql = REPLACE(sql, ${OLD_FORMAT}, ${NEW_FORMAT})
    WHERE type = 'table' AND sql IS NOT NULL
  `.execute(db)
  await sql`PRAGMA writable_schema = 0`.execute(db)

  const integrity = await sql<{
    integrity_check: string
  }>`PRAGMA integrity_check`.execute(db)
  const ok = integrity.rows.every(row => row.integrity_check === 'ok')
  if (!ok) {
    throw new Error(
      `integrity_check failed after schema rewrite: ${JSON.stringify(integrity.rows)}`,
    )
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`PRAGMA writable_schema = 1`.execute(db)
  await sql`
    UPDATE sqlite_master
    SET sql = REPLACE(sql, ${NEW_FORMAT}, ${OLD_FORMAT})
    WHERE type = 'table' AND sql IS NOT NULL
  `.execute(db)
  await sql`PRAGMA writable_schema = 0`.execute(db)
}
