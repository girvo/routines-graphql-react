import Database from 'better-sqlite3';

const db = new Database(process.env.SQLITE_DB || 'routines.sqlite', { readonly: true });

console.log('=== DATABASE SCHEMA ===\n');

interface TableRow {
  name: string;
}

const tables = db.prepare<unknown[], TableRow>(`
  SELECT name FROM sqlite_master
  WHERE type='table' AND name NOT LIKE 'sqlite_%'
  ORDER BY name
`).all();

console.log('Tables:', tables.map(t => t.name).join(', '));
console.log('\n');

interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

interface IndexInfo {
  seq: number;
  name: string;
  unique: number;
  origin: string;
  partial: number;
}

interface IndexColumnInfo {
  seqno: number;
  cid: number;
  name: string;
}

interface ForeignKeyInfo {
  id: number;
  seq: number;
  table: string;
  from: string;
  to: string;
  on_update: string;
  on_delete: string;
  match: string;
}

tables.forEach(({ name }) => {
  console.log(`TABLE: ${name}`);
  console.log('─'.repeat(60));

  const columns = db.prepare<unknown[], ColumnInfo>(`PRAGMA table_info(${name})`).all();

  columns.forEach(col => {
    const nullable = col.notnull === 0 ? 'NULL' : 'NOT NULL';
    const defaultVal = col.dflt_value !== null ? `DEFAULT ${col.dflt_value}` : '';
    const pk = col.pk > 0 ? 'PRIMARY KEY' : '';
    console.log(`  ${col.name.padEnd(20)} ${col.type.padEnd(15)} ${nullable.padEnd(10)} ${pk} ${defaultVal}`);
  });

  const indexes = db.prepare<unknown[], IndexInfo>(`PRAGMA index_list(${name})`).all();
  if (indexes.length > 0) {
    console.log('\n  Indexes:');
    indexes.forEach(idx => {
      const indexInfo = db.prepare<unknown[], IndexColumnInfo>(`PRAGMA index_info(${idx.name})`).all();
      const columns = indexInfo.map(i => i.name).join(', ');
      const unique = idx.unique ? 'UNIQUE' : '';
      console.log(`    ${idx.name}: ${unique} (${columns})`);
    });
  }

  const fks = db.prepare<unknown[], ForeignKeyInfo>(`PRAGMA foreign_key_list(${name})`).all();
  if (fks.length > 0) {
    console.log('\n  Foreign Keys:');
    fks.forEach(fk => {
      console.log(`    ${fk.from} -> ${fk.table}(${fk.to})`);
    });
  }

  console.log('\n');
});

console.log('\n=== DDL STATEMENTS ===\n');

interface SchemaDefinition {
  sql: string;
}

tables.forEach(({ name }) => {
  const ddl = db.prepare<[string], SchemaDefinition>(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(name);
  if (ddl?.sql) {
    console.log(ddl.sql);
    console.log('\n');
  }
});

db.close();
