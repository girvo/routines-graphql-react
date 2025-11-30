import type { Database } from './types.ts' // this is the Database interface we defined earlier
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { getDirname } from '../../tools/paths.ts'
import { resolve } from 'node:path'

export const getDb = () => {
  const __dirname = getDirname(import.meta.url)

  if (!process.env.SQLITE_DB) {
    throw new Error('No SQLITE_DB variable defined')
  }

  if (process.env.NODE_ENV === 'test' && process.env.SQLITE_DB === ':memory:') {
    throw new Error('how did we get here???')
  }

  const dialect = new SqliteDialect({
    database: new SQLite(resolve(__dirname, '..', '..', process.env.SQLITE_DB)),
  })

  // Database interface is passed to Kysely's constructor, and from now on, Kysely
  // knows your database structure.
  // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
  // to communicate with your database.
  return new Kysely<Database>({
    dialect,
  })
}
