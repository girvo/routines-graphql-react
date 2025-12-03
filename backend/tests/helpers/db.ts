import { Migrator, FileMigrationProvider } from 'kysely'
import { promises as fs } from 'node:fs'
import { join, resolve } from 'node:path'
import { db, type Database } from '../../src/database/index.ts'

export const migrateTestDb = async () => {
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
}

export const clearAllTables = async () => {
  const tables = await db.introspection.getTables()
  for (const table of tables) {
    await db.deleteFrom(table.name as keyof Database).execute()
  }
}
