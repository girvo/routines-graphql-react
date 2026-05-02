# Frontend

NEVER write inline utility functions. ALWAYS check `src/utils/` first and add new utilities there if needed.

ALWAYS check usehooks-ts first instead of writing your own utility function.

NEVER write barrel files: re-export index.ts files are BANNED. NEVER.

DO NOT use the useLazyLoadQuery hook without checking with me first. It is unacceptable to use.

NEVER extract a Relay `graphql\`...\`` template into a named const. Always inline it as the first argument to `usePreloadedQuery`, `useFragment`, `useLazyLoadQuery`, `useMutation`, `useSubscription`, etc. The tagged template must be co-located with the hook that consumes it — Relay's compiler relies on the call-site association, and the inlined form is what the team reads as idiomatic.

## Type checking

The frontend uses TypeScript project references (`tsconfig.json` is a root with `references`, no own files). Plain `tsc --noEmit` will silently exit 0 without checking anything. Always type-check via `pnpm typecheck` (which runs `tsc -b`) so all referenced projects (`tsconfig.app.json`, `tsconfig.node.json`, `.storybook/tsconfig.json`) are actually traversed.
