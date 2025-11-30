import { Kysely, Migrator, FileMigrationProvider, SqliteDialect } from 'kysely'
import { promises as fs } from 'node:fs'
import { join, resolve } from 'node:path'
import SQLite from 'better-sqlite3'
import type { Database } from '../../src/database/types.ts'

// re-export for usage
export type { Database }

export const createTestDb = async () => {
  const dialect = new SqliteDialect({
    database: new SQLite(':memory:'),
  })

  const db = new Kysely<Database>({ dialect })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path: { join },
      migrationFolder: resolve(__dirname, '../../migrations'),
    }),
  })

  const result = await migrator.migrateToLatest()
  if (result.error) {
    const errMessage =
      'Error migrating in-memory SQLite, check results for more information'
    console.error(errMessage, result.error, result.results)
    throw new Error(errMessage)
  }

  return db
}

export const destroyTestDb = async (db: Kysely<Database>) => {
  await db.destroy()
}
