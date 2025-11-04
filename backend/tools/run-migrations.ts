#!/usr/bin/env node

import { promises as fs } from 'node:fs'
import { join, resolve } from 'node:path'
import { Kysely, SqliteDialect, Migrator, FileMigrationProvider } from 'kysely'
import Database from 'better-sqlite3'
import { getDirname } from './paths.ts'

const __dirname = getDirname(import.meta.url)

if (!process.env.SQLITE_DB) {
  throw new Error('No SQLITE_DB defined in environment')
}

const db = new Kysely({
  dialect: new SqliteDialect({
    database: new Database(process.env.SQLITE_DB),
  }),
})

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path: { join },
    migrationFolder: resolve(__dirname, '../migrations'),
  }),
})

const runMigrations = async () => {
  const command = process.argv[2]

  if (!command || !['latest', 'up', 'down'].includes(command)) {
    console.error('Error: Invalid command')
    console.error('Usage: yarn tools/run-migrations.ts <latest|up|down>')
    process.exit(1)
  }

  let result

  switch (command) {
    case 'up':
      result = await migrator.migrateUp()
      break
    case 'down':
      result = await migrator.migrateDown()
      break
    case 'latest':
    default:
      result = await migrator.migrateToLatest()
  }

  if (result.error) {
    console.error('Migration failed:', result.error)
    process.exit(1)
  }

  if (result.results) {
    result.results.forEach(it => {
      if (it.status === 'Success') {
        console.log(`✓ ${it.migrationName}`)
      } else if (it.status === 'Error') {
        console.error(`✗ ${it.migrationName}`)
      }
    })
  }

  await db.destroy()
}

await runMigrations()
