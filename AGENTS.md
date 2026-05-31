# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

CRITICAL: Use the repo's CLI validation tools instead of LSP/VSCode diagnostics. In Pi, editor diagnostics are not available reliably, so do not spend turns trying to access them. Prefer the narrowest relevant command first, then broaden only when needed.

CRITICAL: Prefer hard validation over extended reasoning whenever a deterministic validation command exists. Run the narrowest CLI command that can prove or disprove the current assumption instead of spending turns inferring behavior from source code. Examples: run the targeted Storybook interaction test for a Storybook play change, run Relay after changing GraphQL selections, run the relevant package typecheck after changing typed code, and run the focused backend/frontend test for behavior changes.

When a validation command fails, inspect the exact failing file/line, local imports/bindings, and the concrete error output first. Do not investigate package internals, generated bundles, framework docs, or unrelated components until local causes have been ruled out. After a fix, rerun the same failing command before broadening validation.

## Stuck-Loop Control

When a narrow validation command fails, do not continue abstract reasoning for more than one short pass. Convert the failure into the smallest concrete experiment that can prove or disprove the current hypothesis.

Required loop:
1. State the current hypothesis in one sentence.
2. Make the smallest code or test-harness change that isolates that hypothesis.
3. Rerun the same narrow failing command.
4. If the result does not match the hypothesis, discard or revise the hypothesis. Do not keep re-explaining it.

If the same assertion fails twice after two different fixes, stop changing production/component code. Inspect the test harness timing, mock operation order, and whether the assertion actually observes the intended state.

For async UI tests, do not use a fixed timeout as the final proof of state. Use `waitFor` for eventual UI outcomes. When a test must observe an intermediate async state, control the async boundary explicitly with a deferred promise or deliberately delayed resolver instead of hoping to catch a `setTimeout(..., 0)` window.

If your written diagnosis says the code needs change X, first verify whether change X is already present in the current file. If it is already present, the diagnosis is stale; form a new hypothesis from the latest failure output.

## Project Overview

This is a monorepo for a routines application with a GraphQL backend and frontend. It uses PNPM, NOT NPM DIRECTLY

NOTE: DO NOT EVER RUN `npm`, only ever `pnpm`. If you feel you have to use `npm`, ASK THE USER FOR CONFIRMATION FIRST.

## Monorepo Structure

- **Root**: Monorepo configuration with pnpm workspaces
- **backend/**: Fastify server with GraphQL Yoga
- **frontend/**: Frontend application (minimal setup currently)
- **schema.graphql**: Shared GraphQL schema at the root

## Pi Context File Loading

Pi loads `AGENTS.md` from the startup/current working directory and its parent directories, plus the global `~/.pi/agent/AGENTS.md`; it does not automatically load nested package files based on edited paths. When Pi is started from the repo root, frontend/backend-specific guidance must live in this root `AGENTS.md` to be reliably available. Reference: `/Users/josh/.nvm/versions/node/v24.8.0/lib/node_modules/@mariozechner/pi-coding-agent/README.md`, "Context Files" section.

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

### Frontend TypeScript Checks

The frontend root `tsconfig.json` is a solution-style config with project references. Do **not** rely on plain `tsc --noEmit` from `frontend/`; it can typecheck no source files and miss errors in `src/**/*.stories.tsx`.

Use one of these instead:

```bash
# Preferred full frontend typecheck, includes app, Storybook stories, and Vitest config
pnpm --filter @my-routines/frontend typecheck

# Target the app/story source project directly when investigating src or stories
pnpm --filter @my-routines/frontend exec tsc --noEmit -p tsconfig.app.json
```

Story files under `frontend/src` are included by `tsconfig.app.json`, so unused variables and other strict TypeScript errors in stories should be caught by the commands above.

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
