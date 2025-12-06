# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for a routines application with a GraphQL backend and frontend. It uses PNPM, NOT NPM DIRECTLY

NOTE: DO NOT EVER RUN `npm`, only ever `pnpm`. If you feel you have to use `npm`, ASK THE USER FOR CONFIRMATION FIRST.

## Monorepo Structure

- **Root**: Monorepo configuration with pnpm workspaces
- **backend/**: Fastify server with GraphQL Yoga
- **frontend/**: Frontend application (minimal setup currently)
- **schema.graphql**: Shared GraphQL schema at the root

## Key Development Commands

All commands should be run from the repository root:

```bash
# Install dependencies
pnpm install

# Start the backend server
pnpm --filter @my-routines/backend start

# Lint code
pnpm eslint .

# Format code
pnpm prettier --write .
```

## Backend Architecture

The backend uses:

- **Fastify** as the HTTP server
- **GraphQL Yoga** for GraphQL execution
- **Node.js native module resolution** (type: "module", .ts extensions in imports)

### Important Backend Details

1. **Schema Loading**: The GraphQL schema is loaded from `../../schema.graphql` relative to `backend/src/main.ts` (line 10)

2. **Resolver Structure**:
   - Resolvers are defined in `backend/src/graphql/resolvers.ts`
   - Resolvers are imported from each domain, like `backend/src/user/user-resolvers.ts`
   - Wire them up in `backend/src/graphql/resolvers.ts` under the appropriate operation type (Query, Mutation, etc.)

3. **Import Extensions**: Due to `rewriteRelativeImportExtensions`, all local imports must include `.ts` extensions (e.g., `import * as resolvers from './resolvers/index.ts'`)

4. **Server Port**: The backend runs on port 4000

## TypeScript Configuration

- **Module System**: ESNext with Node.js Next resolution
- **No Emit**: TypeScript is used for type checking only; Node.js runs .ts files directly
- **Verbatim Module Syntax**: Import/export syntax is preserved as-is

## Comments and coding format

Do NOT write useless comments like in the following typescript code snippet:

```
// Get all tables
const tables = db.prepare(`
  SELECT name FROM sqlite_master
  WHERE type='table' AND name NOT LIKE 'sqlite_%'
  ORDER BY name
`).all() as Array<{ name: string }>;

console.log('Tables:', tables.map(t => t.name).join(', '));
console.log('\n');

// For each table, get its schema
tables.forEach(({ name }) => {
  console.log(`TABLE: ${name}`);
  console.log('─'.repeat(60));

  // Get column info
  const columns = db.prepare(`PRAGMA table_info(${name})`).all() as Array<{
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: any;
    pk: number;
  }>;
```

These comments are unhelpful: ensure your variable names and function names are clear and self-documenting instead. Only write comments when a block of code is not clear at a first glance as to what it is doing.
