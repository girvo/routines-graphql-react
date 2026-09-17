/**
 * Migration: add_position_to_routine_slots
 * Created: 2026-09-18
 *
 * `routine_slots` is the Task -> DaySection edge, so user-defined Task order
 * lives here as `position`, dense `0..n-1` within each
 * (user_id, day_of_week, section) scope of *live* rows.
 *
 * The backfill runs in JS rather than `UPDATE ... FROM` so it doesn't depend on
 * SQLite's (recent) support for it, and it reproduces the order the app already
 * served — `created_at asc, id asc` — so adding the column is a visual no-op.
 *
 * Only live rows are backfilled. Soft-deleted rows keep the `DEFAULT 0`: every
 * scope read filters `deleted_at is null`, and grouping them in would punch
 * holes in the live numbering. The revive path assigns a fresh end-of-scope
 * position instead of reusing the stale one.
 *
 * There is deliberately NO UNIQUE index on `(user_id, day_of_week, section,
 * position)`. SQLite validates UNIQUE per statement, not deferred to commit, so
 * a batch of renumbering UPDATEs inside one transaction transiently collides
 * while two rows still share an index. Density is therefore app-enforced inside
 * a single write transaction; the partial index below is for reads only.
 */
import { Kysely, sql } from 'kysely'

interface LiveSlotRow {
  id: number
  user_id: number
  day_of_week: string
  section: string
  position: number
}

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('routine_slots')
    .addColumn('position', 'integer', col => col.notNull().defaultTo(0))
    .execute()

  const rows = (await db
    .selectFrom('routine_slots')
    .select(['id', 'user_id', 'day_of_week', 'section', 'position'])
    .where('deleted_at', 'is', null)
    .orderBy('user_id')
    .orderBy('day_of_week')
    .orderBy('section')
    .orderBy('created_at')
    .orderBy('id')
    .execute()) as LiveSlotRow[]

  let scope: string | null = null
  let nextPosition = 0
  for (const row of rows) {
    const rowScope = `${row.user_id}|${row.day_of_week}|${row.section}`
    if (rowScope !== scope) {
      scope = rowScope
      nextPosition = 0
    }
    if (row.position !== nextPosition) {
      await db
        .updateTable('routine_slots')
        .set({ position: nextPosition })
        .where('id', '=', row.id)
        .execute()
    }
    nextPosition += 1
  }

  await sql`
    create index idx_routine_slots_scope_position
    on routine_slots (user_id, day_of_week, section, position)
    where deleted_at is null
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  // SQLite refuses DROP COLUMN while an index still references the column.
  await db.schema.dropIndex('idx_routine_slots_scope_position').execute()
  await db.schema.alterTable('routine_slots').dropColumn('position').execute()
}
