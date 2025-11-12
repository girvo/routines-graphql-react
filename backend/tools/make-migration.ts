#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { getDirname } from './paths.ts'

const __dirname = getDirname(import.meta.url)

/**
 * Converts a string to camel_case format
 */
const toCamelCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

/**
 * Generates an ISO 8601 timestamp string (YYYYMMDDTHHMMSS format)
 */
const getTimestamp = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

  return `${year}${month}${day}T${hours}${minutes}${seconds}${milliseconds}`
}

const createMigration = async () => {
  const migrationName = process.argv[2]

  if (!migrationName) {
    console.error('Error: Migration name is required')
    console.error('Usage: pnpm tools/make-migration.ts <migration-name>')
    process.exit(1)
  }

  const timestamp = getTimestamp()
  const camelCaseName = toCamelCase(migrationName)

  if (!camelCaseName) {
    console.error(
      'Error: Migration name must contain at least one alphanumeric character',
    )
    process.exit(1)
  }

  const filename = `${timestamp}_${camelCaseName}.ts`

  const migrationsDir = resolve(__dirname, '../migrations')
  const migrationPath = join(migrationsDir, filename)

  try {
    // Ensure migrations directory exists
    await mkdir(migrationsDir, { recursive: true })

    const template = `/**
 * Migration: ${migrationName}
 * Created: ${new Date().toISOString()}
 */
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
`

    await writeFile(migrationPath, template, 'utf-8')

    console.log(`\u2713 Created migration: ${filename}`)
    console.log(`  Location: ${migrationPath}`)
  } catch (error) {
    console.error('Error creating migration:', error)
    process.exit(1)
  }
}

createMigration()
