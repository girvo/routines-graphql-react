/**
 * Migration: normalize_timestamps_to_iso
 * Created: 2026-05-03T01:40:52.873Z
 *
 * Rewrites every timestamp column to ISO 8601 UTC. Pre-existing rows mix
 * SQLite-default UTC space-separated values, date-fns local-time
 * space-separated values (from `getCurrentTimestamp` before its fix), and
 * `.toISOString()` UTC values. Lexicographic comparisons across formats
 * produced incorrect results — most visibly, today's task completions
 * weren't matching the today-window query.
 *
 * Conversion uses JS `new Date(...)`, which parses already-ISO values
 * idempotently and treats space-separated values as local time. That second
 * branch is wrong for the few SQLite-default rows (which were UTC), but in
 * practice that only affects `users.created_at` / `users.updated_at` where
 * exact timing isn't load-bearing.
 */
import { Kysely } from 'kysely'

const TIMESTAMP_COLUMNS = [
  { table: 'users', cols: ['created_at', 'updated_at', 'last_logged_in'] },
  { table: 'tasks', cols: ['created_at', 'updated_at', 'deleted_at'] },
  { table: 'routine_slots', cols: ['created_at', 'deleted_at'] },
  { table: 'task_completions', cols: ['completed_at', 'created_at'] },
  { table: 'refresh_tokens', cols: ['created_at', 'expires_at', 'revoked_at'] },
] as const

const toIsoOrSelf = (value: unknown): string | null => {
  if (value == null) return null
  if (typeof value !== 'string') return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toISOString()
}

export async function up(db: Kysely<any>): Promise<void> {
  for (const { table, cols } of TIMESTAMP_COLUMNS) {
    const rows: Array<Record<string, unknown>> = await db
      .selectFrom(table)
      .select(['id', ...cols])
      .execute()

    for (const row of rows) {
      const updates: Record<string, string | null> = {}
      for (const col of cols) {
        const original = row[col]
        if (original == null) continue
        const next = toIsoOrSelf(original)
        if (next !== original) updates[col] = next
      }
      if (Object.keys(updates).length === 0) continue
      await db
        .updateTable(table)
        .set(updates)
        .where('id', '=', row.id as number)
        .execute()
    }
  }
}

export async function down(): Promise<void> {
  // Irreversible: original per-row source format isn't recoverable.
}
