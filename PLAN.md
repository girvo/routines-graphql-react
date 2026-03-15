# Plan: `rolldown-plugin-relay`

A native Rolldown/Vite plugin to replace `babel-plugin-relay`, eliminating Babel from the build pipeline.

## What `babel-plugin-relay` does

The transform is simple. Given source code like:

```tsx
import { graphql, useFragment } from 'react-relay';

const fragment = useFragment(
  graphql`
    fragment TaskDisplay on Task {
      id
      title
    }
  `,
  taskRef
);
```

It produces:

```tsx
import _TaskDisplay from './__generated__/TaskDisplay.graphql';

const fragment = useFragment(_TaskDisplay, taskRef);
```

In dev mode, it wraps the replacement with a staleness check:

```tsx
import _TaskDisplay from './__generated__/TaskDisplay.graphql';

const fragment = useFragment(
  (_TaskDisplay.hash !== null &&
    _TaskDisplay.hash !== '<md5>' &&
    console.error("The definition of 'TaskDisplay' appears to have changed..."),
  _TaskDisplay),
  taskRef
);
```

That's it. Find `graphql` tagged templates, parse the GraphQL to get the definition name, replace with an import reference.

## Why this is straightforward

- Relay **forbids** interpolations (`${...}`) inside `graphql` tags — the content is always a flat string
- No complex AST rewriting — it's a find-and-replace with an import prepended
- The Rolldown `transform` hook provides `(code, id)` and expects new code back — same as Rollup
- `magic-string` handles sourcemaps

## Package setup

Create a new package in the monorepo: `packages/rolldown-plugin-relay/`

```
packages/rolldown-plugin-relay/
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json
```

Add `packages/*` to `pnpm-workspace.yaml`. Dependencies: `magic-string`, `graphql` (peer dep). Dev dependencies: `rolldown` (for types), `vitest` (for tests).

## Plugin implementation

### 1. Plugin skeleton

```ts
import type { Plugin } from 'rolldown';

export interface RelayPluginOptions {
  artifactDirectory?: string;  // custom artifact dir (default: colocated __generated__)
  isDev?: boolean;             // enable hash staleness warnings (default: true)
}

export default function relay(options?: RelayPluginOptions): Plugin {
  return {
    name: 'rolldown-plugin-relay',
    transform: {
      filter: { id: { include: [/\.[jt]sx?$/] } },
      handler(code, id) {
        // ... transform logic
      },
    },
  };
}
```

### 2. Find `graphql` tagged templates

Use a regex: `` /graphql`([\s\S]*?)`/g ``

This is safe because:
- Relay forbids interpolations, so the backtick-to-backtick range is always the full content
- Edge cases (graphql in comments/strings) are theoretically possible but don't occur in practice in Relay codebases — this is the same approach `vite-plugin-relay-lite` uses successfully

Quick-exit: if the regex doesn't match, return `null` (no transform needed).

### 3. Parse GraphQL and extract definition name

```ts
import { parse, print } from 'graphql';
import { createHash } from 'crypto';

const doc = parse(graphqlText);
const definition = doc.definitions[0];
const definitionName = definition.name.value;  // e.g. "TaskDisplay"
const hash = createHash('md5').update(print(definition)).digest('hex');
```

### 4. Compute the import path

This project uses colocated `__generated__/` directories (no custom `artifactDirectory` in relay config). The artifact path is always relative to the source file:

```ts
// For a file at src/Tasks/TaskDisplay.tsx with fragment "TaskDisplay":
// → './__generated__/TaskDisplay.graphql'
```

If `artifactDirectory` is set, compute the relative path from the source file to that directory instead.

### 5. Apply the transform with `magic-string`

```ts
import MagicString from 'magic-string';

const s = new MagicString(code);

// For each match, generate a unique import name and:
// 1. Collect imports to prepend
// 2. Replace the graphql`...` expression with the import reference

s.prepend(`import _TaskDisplay from './__generated__/TaskDisplay.graphql';\n`);
s.overwrite(matchStart, matchEnd, '_TaskDisplay');
// (or the dev-mode hash-check wrapper)

return { code: s.toString(), map: s.generateMap({ hires: true }) };
```

### 6. Dev mode hash check (optional)

When `isDev` is true, instead of replacing with just `_TaskDisplay`, replace with:

```ts
(_TaskDisplay.hash !== null && _TaskDisplay.hash !== "<hash>" && console.error("..."), _TaskDisplay)
```

## Edge cases to handle

- **Multiple `graphql` tags in one file** — collect all imports, prepend all at once, replace each tag independently. Generate unique import names to avoid collisions (though in practice Relay enforces unique definition names).
- **The `graphql` tag used as an expression vs. assigned to a variable** — doesn't matter, the replacement is the same (swap the tagged template expression for the import reference).
- **Files that import `graphql` from `react-relay` or `relay-runtime`** — the plugin doesn't need to care about where `graphql` is imported from. It just looks for `graphql` tagged template literals. The `graphql` import itself can be left in place (tree-shaking will remove it) or optionally cleaned up.

## Testing

Write tests with `vitest` that verify:

1. A file with a single fragment is correctly transformed
2. A file with a single query is correctly transformed
3. A file with multiple `graphql` tags gets multiple imports and replacements
4. A file with no `graphql` tags is passed through unchanged (returns null)
5. Dev mode wraps with hash check, prod mode does not
6. `artifactDirectory` option computes correct relative paths

Test by calling the `transform.handler` function directly with sample code strings — no need for a full Rolldown build in unit tests.

## Integration into the frontend

In `frontend/vite.config.ts`:

```ts
import relay from '@my-routines/rolldown-plugin-relay';

export default defineConfig({
  plugins: [
    react(),          // @vitejs/plugin-react v6, no babel config
    relay(),
    tailwindcss(),
  ],
  // ...
});
```

Remove `babel-plugin-relay` from devDependencies.

## Scope boundaries

Things this plugin does NOT need to handle:
- **Haste module format** — we don't use it
- **Persisted queries** — not in use
- **`@inline` directive handling** — the relay compiler handles this, not the babel plugin
- **Running the relay compiler** — that's a separate step (`pnpm relay`)
