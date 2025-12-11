You're right, I was rolling a custom version rather than using Relay's actual entrypoint primitives. Partly because the Relay entrypoint APIs are designed around a specific loading model that assumes you have more control over the router integration, but there's no reason you *can't* use them with React Router.

Let me sketch it with the actual Relay APIs:

**The entrypoint definition using Relay's expected shape:**

```typescript
// habits/HabitDetail.entrypoint.ts
import type { EntryPoint } from 'react-relay';
import type { HabitDetailQuery } from './__generated__/HabitDetailQuery.graphql';

// The type for the props your component receives via entrypoint
type HabitDetailEntryPointParams = {
  id: string;
};

export const HabitDetailEntryPoint: EntryPoint<HabitDetailEntryPointParams, HabitDetailQuery> = {
  getPreloadProps: (params) => ({
    queries: {
      habitQuery: {
        parameters: require('./__generated__/HabitDetailQuery$parameters'),
        variables: { id: params.id },
      },
    },
  }),
  root: () => import('./HabitDetail'),
};
```

**The component using `usePreloadedQuery` with the entrypoint queries:**

```typescript
// habits/HabitDetail.tsx
import { usePreloadedQuery } from 'react-relay';
import type { PreloadedQuery } from 'react-relay';
import HabitDetailQuery from './__generated__/HabitDetailQuery.graphql';
import type { HabitDetailQuery as HabitDetailQueryType } from './__generated__/HabitDetailQuery.graphql';

type Props = {
  queries: {
    habitQuery: PreloadedQuery<HabitDetailQueryType>;
  };
};

export default function HabitDetail({ queries }: Props) {
  const data = usePreloadedQuery(HabitDetailQuery, queries.habitQuery);
  return <div>{data.habit?.name}</div>;
}
```

**Using `prepareEntryPoint` in the router loader:**

```typescript
// routing/loadEntryPoint.ts
import { prepareEntryPoint } from 'react-relay';
import { environment } from '../relay/environment';

export function loadEntryPoint<TParams>(
  entrypoint: EntryPoint<TParams, any>,
  params: TParams
) {
  return prepareEntryPoint(
    { getEnvironment: () => environment },
    entrypoint,
    params
  );
}
```

**The route definition:**

```typescript
// routes.tsx
import { createBrowserRouter, useLoaderData } from 'react-router-dom';
import { EntryPointContainer } from 'react-relay';
import { loadEntryPoint } from './routing/loadEntryPoint';
import { HabitDetailEntryPoint } from './habits/HabitDetail.entrypoint';

export const router = createBrowserRouter([
  {
    path: '/habits/:id',
    loader: ({ params }) => loadEntryPoint(HabitDetailEntryPoint, { id: params.id! }),
    Component: function HabitDetailRoute() {
      const entryPointReference = useLoaderData();
      return <EntryPointContainer entryPointReference={entryPointReference} props={{}} />;
    },
  },
]);
```

**The key differences from my hand-rolled version:**

1. `getPreloadProps` returns a structured object with `queries` (and optionally `entryPoints` for nested entrypoints) — Relay knows how to traverse this
2. `prepareEntryPoint` handles kicking off both the component load and all the queries in parallel
3. `EntryPointContainer` is Relay's component that wires up Suspense, renders the loaded component, and passes the preloaded queries through

The catch is that `prepareEntryPoint` and `EntryPointContainer` are documented but somewhat under-documented for use outside Meta's internal routing setup. You may need to handle disposal yourself — the returned reference has a `dispose()` method you'd call when the route unmounts or changes to clean up retained queries.
