---
name: relay-story
description: Generates a Storybook story file for a Relay fragment-based React component using MockPayloadGenerator and a mock Relay environment. Use when asked to create a story for a component that uses useFragment, usePaginationFragment, or useRefetchableFragment.
---

Generate a Storybook story for the Relay component at: $ARGUMENTS

If no path is provided, use the file currently open in the IDE.

## Step 1: Read and analyze the component

Read the component file and identify:

- The **exported component name**
- All **Relay fragment hooks**: `useFragment`, `usePaginationFragment`, `useRefetchableFragment`
  - For each: the **fragment name** (e.g., `RoutineSlotItem`) and the **GraphQL type** it's on (e.g., `on Task`)
- The **props interface**: which props are fragment key types (import type ending in `$key`) vs plain props (strings, callbacks, etc.)
- Whether the component renders inside a `<table>` (check if it renders `<tr>` or `<td>` at the top level)
- Any **mutation hooks** (`useMutation`) the component calls — count them, since each needs its own queued resolver

## Step 2: Determine paths

Story files go side by side with their source files:

- Component: `frontend/src/[Dir]/[ComponentName].tsx`
- Story: `frontend/src/[Dir]/[ComponentName].stories.tsx`
- Generated: `frontend/src/[Dir]/__generated__/[ComponentName]StoryInnerQuery.graphql.ts`

## Step 3: Choose the right template

Use `template/node-fragment-story.tsx` when the component has **one fragment key prop** on a concrete type.

Use `template/multi-fragment-story.tsx` when the component has **multiple fragment key props** or needs a `__typename` guard.

## Step 4: Fill in the template

Replace all placeholders:

| Placeholder | Replace with |
|---|---|
| `COMPONENT_NAME` | The exported component name (e.g., `RoutineSlotItem`) |
| `DIR` | The component's directory relative to `frontend/src/` (e.g., `WeeklyPlan`) |
| `GRAPHQL_TYPE` | The type name from the fragment definition (e.g., `Task`, `Query`) |
| `FRAGMENT_NAME` | The fragment name used in the component (e.g., `RoutineSlotItem`) |
| `FRAGMENT_PROP` | The prop name on the component that accepts the fragment key (e.g., `task`) |

**For non-Relay props:**
- `string` props like `connectionId` → pass `""`
- Callback props → pass `() => {}` (or `() => { console.log('...') }` for visibility)

**For the MockPayloadGenerator:** use `MockPayloadGenerator.generate(op)` with no custom resolvers — it auto-generates all scalar fields. `queueOperationResolver` is **consumed after each operation**, so queue one resolver for the initial query plus one for each mutation the component can trigger (in the order they'd be called).

**If the component renders inside a table** (top-level `<tr>` or `<td>`), wrap the story output with:
```tsx
<table className="table">
  <tbody>
    <COMPONENT_NAMEStoryInner />
  </tbody>
</table>
```

**The `title` in `meta`** should be `'[Dir]/[ComponentName]'` (e.g., `'WeeklyPlan/RoutineSlotItem'`).

**Import path:** The story is in the same directory as the component, so the relative import is `./[ComponentName]`.

## Step 5: Write the story file

Write the completed story to `frontend/src/[Dir]/[ComponentName].stories.tsx`.

## Step 6: Run the Relay compiler

```bash
pnpm --filter @my-routines/frontend relay
```

This generates the `__generated__/[ComponentName]StoryInnerQuery.graphql.ts` file that the story imports from `./__generated__/[ComponentName]StoryInnerQuery.graphql`.

## Step 7: Verify

Check that:
- The `__generated__` file was created
- The import of the generated query type resolves (uses `.graphql` extension, not `.graphql.ts`)
- No TypeScript errors in the story (check LSP diagnostics)
