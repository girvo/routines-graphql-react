import type { Database } from './types.ts'
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect, type LogConfig } from 'kysely'
import { getDirname } from '../../tools/paths.ts'
import { resolve } from 'node:path'

export type { Database }

const __dirname = getDirname(import.meta.url)

let path = ':memory:'
if (process.env.NODE_ENV !== 'test' && process.env.SQLITE_DB) {
  path = resolve(__dirname, '..', '..', process.env.SQLITE_DB)
} else if (process.env.NODE_ENV !== 'test' && !process.env.SQLITE_DB) {
  throw new Error('You must provde a SQLITE_DB variable in your environment')
}

let log: LogConfig = ['error']
if (process.env.NODE_ENV === 'test') {
  log = ['query', 'error']
}

export const db = new Kysely<Database>({
  log: log,
  dialect: new SqliteDialect({
    database: new SQLite(path),
  }),
})
