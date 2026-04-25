# Frontend

NEVER write inline utility functions. ALWAYS check `src/utils/` first and add new utilities there if needed.

ALWAYS check usehooks-ts first instead of writing your own utility function.

NEVER write barrel files: re-export index.ts files are BANNED. NEVER.

DO NOT use the useLazyLoadQuery hook without checking with me first. It is unacceptable to use.

NEVER extract a Relay `graphql\`...\`` template into a named const. Always inline it as the first argument to `usePreloadedQuery`, `useFragment`, `useLazyLoadQuery`, `useMutation`, `useSubscription`, etc. The tagged template must be co-located with the hook that consumes it — Relay's compiler relies on the call-site association, and the inlined form is what the team reads as idiomatic.
