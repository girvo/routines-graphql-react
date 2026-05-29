---
name: check-db-types
description: Executes the database introspection tool and verifies that Kysely type definitions match the actual database schema
---

## Step 1: Run Database Introspection

Execute the introspection command to get the current database schema:

```bash
pnpm --filter @my-routines/backend db:introspect
```

Read the output to understand the actual database schema including:
- Table names
- Column names and types
- Nullability constraints
- Primary keys
- Foreign keys
- Default values

## Step 2: Read Kysely Type Definitions

Read the TypeScript type definitions from `backend/src/database/types.ts`

## Step 3: Compare Schema with Types

Compare the introspected database schema with the Kysely types. Check for mismatches in:

| Category | What to Verify |
|----------|----------------|
| Table names | All tables exist and are spelled correctly |
| Column names | All columns match exactly |
| Column types | SQLite types map correctly to TypeScript (INTEGER → number, TEXT → string, REAL → number, BLOB → Uint8Array) |
| Nullability | `not null` columns should not have `| undefined` or `| null` |
| Primary keys | Marked correctly in type definitions |
| Foreign keys | Reference types match the referenced table's primary key type |
| Default values | Columns with defaults may be optional in TypeScript |

## Step 4: Report Findings

**If mismatches are found:**
- List each mismatch clearly
- Suggest the exact TypeScript fix for each issue
- Reference the specific line or type that needs updating

**If types are correct:**
- Confirm that all types match the database schema
- Note any conventions used (e.g., optional fields for columns with defaults)

## Notes

- Always use `pnpm`, never `npm`
- Check LSP diagnostics before running additional linters
- SQLite type mappings:
  - `INTEGER` → `number`
  - `TEXT` → `string`
  - `REAL` → `number`
  - `BLOB` → `Uint8Array`
  - `BOOLEAN` (stored as INTEGER) → `number` (0 or 1)
