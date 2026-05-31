---
name: interaction-test
description: Adds a Storybook `play` function (interaction test) to an existing story file. Use when asked to write tests for a Storybook story, add interactions, add a `play` function, or test a component through Storybook. Pairs with `relay-story` (which scaffolds the story); this skill adds the `play`.
---

Add an interaction test (`play` function) to the Storybook story at: $ARGUMENTS

If no path is provided, use the file currently open in the IDE.

## Project context

- Tests run via Vitest's Storybook project: `pnpm --filter @my-routines/frontend test:storybook` (real Chromium tab via Playwright, headless). Configured in `frontend/vitest.config.ts` and `frontend/.storybook/vitest.setup.ts`.
- Every story is already a smoke test by default. Adding a `play` upgrades it: assertion failures or failed interactions fail the story.
- `@storybook/addon-a11y` annotations are wired in, so accessibility violations also fail. Prefer accessible-name queries (`findByRole(name)`) — they double as a11y assertions.
- Stories using `createMockEnvironment` + `MockPayloadGenerator` (the `relay-story` pattern) need extra care: Suspense must resolve before interacting, and any user action that triggers a mutation or refetch needs another resolver queued upfront in the story setup.

## Required execution flow

Follow this flow in order. Do not write or revise the `play` function until the Relay preflight and story setup are understood.

1. Identify the target story file, component file, and exact user interaction to test.
2. Inspect the existing story pattern and providers. Reuse current decorators, wrapper components, and Storybook idioms unless they are the direct cause of the failure.
3. If the story uses Relay, read the generated query, fragment, and mutation files under `__generated__` before editing. Record the root fields, fragment fields, mutation payload types, connection keys, filters, and any generated `ClientExtension __id` fields.
4. List the operations that will occur in order: initial story query, user-triggered mutation/refetch operations, and any local store setup required before interaction.
5. Fix story setup before touching assertions:
   - create a fresh Relay mock environment per story mount,
   - queue one resolver per expected operation in operation order,
   - use flat `MockPayloadGenerator` resolvers keyed by GraphQL type,
   - seed secondary records or connections with `commitLocalUpdate` when the generated query does not expose the needed `__id`,
   - use `environment.commitPayload(operationDescriptor, payload)` only when resolving a specific operation descriptor.
6. Write the `play` function against real user behavior:
   - wait for initial UI with `canvas.findBy...`,
   - use `screen` for portaled dialogs, popovers, toasts, or menus,
   - `await` every `userEvent` interaction,
   - assert the DOM outcome of each mutation or refetch.
7. Regenerate Relay artifacts if GraphQL selections changed.
8. Validate in this order:
   - run the targeted Storybook interaction command,
   - inspect output for Relay warnings, `__id` TypeErrors, unresolved operations, `act` warnings, and Testing Library query failures,
   - run the frontend typecheck when story or generated types changed.
9. If validation fails, fix the first concrete failure and repeat the same validation command. Start with the failing file and line, then local imports/bindings, then the mocked operation shape. Do not inspect packages, primitive components, docs, or generated bundles until those local checks are exhausted.
10. Stop when the targeted Storybook test and required type/Relay checks pass. Do not keep reading generated files, primitive components, or unrelated stories after validation is green.

## Relay story test contract (MANDATORY)

Before editing any `*.stories.tsx` that uses Relay:

1. **Read the generated query file** — `src/<component>/__generated__/<QueryName>.graphql.ts`
   - Confirm the exact root fields the query requests
   - Note any `@connection` directives and their `key` values
   - Note any `ClientExtension` fields like `__id` that appear on connections

2. **Read the generated fragment file** if the story spreads a fragment (e.g. `...TasksList_tasks`)
   - Confirm whether the fragment requests `__id` on its connection
   - Confirm the exact field list the fragment spreads into the component

3. **Mock resolver rules**:
   - Resolvers are **flat, type-keyed**: `MockPayloadGenerator.generate(op, { Task() {...}, TaskEdge() {...}, TaskConnection() {...} })`
   - The `TaskConnection()` return value’s `edges` array is what populates the connection
   - Always include `__id: '<some-string>'` on connection records if the query/fragment requests it
   - Do **not** nest resolver returns under the query root — the generator maps by type name, not path

4. **Mutation wiring**:
   - `@appendEdge(connections: $connections)` and `@deleteEdge(connections: $connections)` run against every connection ID in the component's mutation variables
   - If the component sends a secondary connection ID such as `ConnectionHandler.getConnectionID(task.id, 'Task_slots')`, seed that connection in the story store with `commitLocalUpdate`; do not change production component code to skip missing mock connections
   - If you manually commit payloads, use the real API shape: `environment.commitPayload(operationDescriptor, payload)`. Do not call `environment.commitPayload({ data: ... })` or `environment.mock.getStore().commitPayload(...)`

5. **Validation before moving on**:
   - Run `pnpm --filter @my-routines/frontend test:storybook --reporter=verbose` after editing **each** story file
   - Confirm 0 warnings containing `[Relay]` and 0 `TypeError: Cannot read properties of undefined (reading '__id')`
   - If a warning or error appears, read the stderr line to identify which field/type is missing — do not change the query shape to match the mock; fix the mock to match the query

---

## MockPayloadGenerator runtime contract (confirmed)

- Resolver signature: `(context, genId) => returnValue`
- `genId()` returns a monotonically increasing `number` (starts at 1)
- `context` always contains: `parentType` (string | undefined), `alias` (string | undefined), `name` (string)
- If a resolver returns `undefined`, the generator falls back to `"<mock-value-for-field-\"name\">"`
- Resolvers are **flat, type-keyed by GraphQL type name** — the generator maps by type name, not by query path or field name
- The `data: {}` return shape bypasses `MockPayloadGenerator` entirely; it is a different, non-normalizing mechanism. Always use `MockPayloadGenerator.generate(op, { TypeName() {...} })`
- Keep linked fields flat too: connection resolvers may return `__id` and placeholder `edges`, but linked records such as `pageInfo`, `node`, `task`, and `routineSlot` should be supplied by their own type resolvers.

## Mock environment commit API (confirmed)

- `environment.commitPayload(operationDescriptor, payload)` is available directly on the mock environment instance
- `environment.mock.getStore()` does **not** return an object with `commitPayload`
- Use `commitLocalUpdate(environment, store => { ... })` to seed records/connections that the story needs before interactions
- For a pending operation, get the descriptor with `environment.mock.getMostRecentOperation()` or `findOperation(...)`, then call `environment.commitPayload(operation, payload)`

---

## Step 1: Read the story and the component

Read the story file and the component it renders. Identify:

- The story exports that should get a `play` (typically `Default`, plus any variants the user named).
- Whether the story uses a **mock Relay environment** (`createMockEnvironment`, `MockPayloadGenerator.generate`) or renders against a real one.
- Whether the component renders into a **portal** — search the component (and its children) for any of: `Popover`, `PopoverContent`, `Modal`, `ConfirmDialog`, `Tooltip`, `Dialog`, or a direct `createPortal` call. Portaled content is attached to `document.body`, not the story's canvas, and `within(canvasElement)` will not find it.
- Mutations and refetches the user can trigger from the rendered UI. Each one consumes a queued `MockPayloadGenerator` resolver — the story author needs to queue enough.
- Any `args` callbacks worth asserting (e.g., `onSelect`, `onClose`). Mark these as `fn()` in `meta.args` so the `play` can assert on them.

> **Relay stories:** complete the mandatory pre-flight checklist above before proceeding.

## Step 2: Imports

Import everything from `'storybook/test'`. Never from `@testing-library/*`, `vitest`, or `@storybook/test` directly — Storybook re-exports the testing-library APIs and routes them through the Interactions panel; mixing sources fragments the UI and may pull mismatched versions.

```ts
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
```

What each is for:

- `within(canvasElement)` — queries scoped to the story's rendered canvas.
- `screen` — queries against `document.body`. **Required for portaled content.**
- `userEvent` — clicks, typing, keyboard, hover, tab. Always `await` it.
- `expect` — jest-dom matchers (`toBeInTheDocument`, `toHaveAccessibleName`, `toHaveValue`, `toBeDisabled`, `toHaveFocus`, …) plus standard expectations.
- `fn()` — spies for `args` callbacks. Use this, not `vi.fn()`.
- `waitFor` — only when no `findBy*` query fits the wait condition.
- `findBy*` (async, retries up to ~1s) — preferred over `getBy*` whenever waiting on Suspense, transitions, mutations, or portal rendering.

---

## Canonical Relay story pattern

Use this as the template for any story that renders a Relay connection and/or triggers a mutation. Copy the structure, replace the types and field names with those from your generated query/fragment files.

Key points:

- The resolver object is flat and keyed by GraphQL type name.
- `RoutineSlotConnection()` returns placeholder edge objects; `RoutineSlotEdge()`, `RoutineSlot()`, and `Task()` fill those records.
- Keep the mock records explicit in the story. Avoid generic `taskNode()` / `taskEdge()` helper functions unless the repeated shape is large enough to justify the indirection.
- Seed secondary mutation connections in the story store; never alter production mutation variables just to silence Relay mock warnings.

```tsx
import { ConnectionHandler, commitLocalUpdate } from 'relay-runtime'

const environment = createMockEnvironment()

const slots = [
  {
    id: 'routine-slot-pushups',
    taskId: 'task-pushups',
    title: 'Pushups',
    cursor: 'cursor-pushups',
  },
  {
    id: 'routine-slot-squats',
    taskId: 'task-squats',
    title: 'Squats',
    cursor: 'cursor-squats',
  },
]
let edgeIndex = 0
let slotIndex = 0
let taskIndex = 0

environment.mock.queueOperationResolver(op =>
  MockPayloadGenerator.generate(op, {
    WeeklySchedulePayload() {
      return {}
    },
    DaySchedule() {
      return { dayOfWeek: 'MONDAY' }
    },
    RoutineSlotConnection() {
      return {
        edges: [{}, {}],
        pageInfo: { endCursor: 'cursor-squats', hasNextPage: false },
      }
    },
    RoutineSlotEdge() {
      return { cursor: slots[edgeIndex++].cursor }
    },
    RoutineSlot() {
      const slot = slots[slotIndex++]
      return {
        id: slot.id,
        dayOfWeek: 'MONDAY',
      }
    },
    Task() {
      const slot = slots[taskIndex++]
      return {
        id: slot.taskId,
        title: slot.title,
        icon: 'dumbbell',
      }
    },
  }),
)

// Seed secondary connection IDs that the component will include in
// mutation variables, e.g. ConnectionHandler.getConnectionID(task.id, 'Task_slots').
commitLocalUpdate(environment, store => {
  const connectionId = ConnectionHandler.getConnectionID('task-pushups', 'Task_slots')
  const connection =
    store.get(connectionId) ?? store.create(connectionId, 'RoutineSlotConnection')
  const pageInfo =
    connection.getLinkedRecord('pageInfo') ??
    store.create(`${connectionId}:pageInfo`, 'PageInfo')

  pageInfo.setValue(null, 'endCursor')
  pageInfo.setValue(false, 'hasNextPage')
  connection.setValue(0, '__connection_next_edge_index')
  connection.setLinkedRecords([], 'edges')
  connection.setLinkedRecord(pageInfo, 'pageInfo')
})

// Mutation resolver: queued before the play triggers the mutation.
environment.mock.queueOperationResolver(op =>
  MockPayloadGenerator.generate(op, {
    DeleteRoutineSlotPayload() {
      return {
        deletedId: 'routine-slot-pushups',
      }
    },
  }),
)
```

---

## Step 3: Query priority

Match Testing Library's recommended order. Higher = better:

1. `findByRole(role, { name })` — accessible role + name. First choice.
2. `findByLabelText` — form fields with associated labels.
3. `findByPlaceholderText` — only if no label exists.
4. `findByText` — non-interactive copy.
5. `findByDisplayValue` — current value of an input.
6. `findByTestId` — last resort. Only add a `data-testid` when nothing semantic fits, and prefer fixing the component's accessibility instead.

---

## Step 4: Write the play function

Skeleton — wrap distinct phases in `step()` so the Interactions panel shows them as labeled sections:

```ts
export const Default: Story = {
  args: { ... },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('renders the trigger', async () => {
      expect(
        await canvas.findByRole('button', { name: /add task/i }),
      ).toBeInTheDocument()
    })

    await step('opens the dropdown and filters', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /add task/i }))
      const search = await screen.findByPlaceholderText(/search tasks/i)
      await userEvent.type(search, 'push')
      expect(await screen.findByRole('option', { name: /pushups/i })).toBeInTheDocument()
    })
  },
}
```

Always `await` `userEvent.*` calls. Always `await` async queries.

**For each story that triggers a mutation, add exactly one DOM assertion that proves the mutation reached the store:**
- If the mutation appends an edge: `await waitFor(() => expect(canvas.getAllByText('Planks').length).toBeGreaterThan(0))`
- If the mutation deletes a record: `await waitFor(() => expect(screen.queryByText('Pushups')).not.toBeInTheDocument())`
- If the mutation toggles state: `await waitFor(() => expect(canvas.getByRole('checkbox')).toBeChecked())`

Do **not** assert exact counts after create/append mutations unless the optimistic ID and server ID are guaranteed to reconcile. In this app, optimistic IDs often differ from mock server IDs, so the same title can appear twice while the interaction is still valid.

If the assertion fails, the cause is usually a mock data shape mismatch (see pre-flight checklist steps 1-3), not the assertion itself. Fix the mock before changing the component.

---

## Step 5: Mock-Relay pitfalls

For stories built on `createMockEnvironment` + `MockPayloadGenerator`:

- **Wait for Suspense before interacting.** The first `findBy*` after mount handles this naturally; don't use `getBy*` immediately after the story renders.
- **Resolvers are flat, type-keyed hooks.** `MockPayloadGenerator.generate(op, { Task() {...}, TaskEdge() {...}, TaskConnection() {...} })` maps by GraphQL type name, not by query path. The `TaskConnection()` return value's `edges` array is what populates the connection in the store; the edge/node resolvers fill the nested records. Do **not** nest resolver returns under the query root — the generator never reaches them that way.
- **Queue extra resolvers in the story setup, not the play.** Every operation the `play` will trigger needs its own queued resolver. The story already queues the initial query; add one resolver per mutation, refetch, or follow-up query the play will fire. If the resolvers run out, Relay throws.
- **Use a fresh mock environment per story mount.** Create the environment inside a story wrapper with `useState(createEnvironment)` or inside the render function. Do not share a module-scope environment across Storybook stories; queued resolvers and pending operations are consumed state.
- **Mock data is deterministic but ugly.** Default fields look like `"<mock-value-for-field-\"title\">"`. Either match against those literal strings (fine for assertions you don't read) or pass a custom resolver in the story setup that returns realistic values for the fields the play asserts on:
  ```ts
  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      Task: () => ({ title: 'Pushups', icon: 'dumbbell' }),
    }),
  )
  ```
- **Optimistic updates land synchronously**, then Relay rolls them back when the operation settles and applies the real payload. For optimistic Relay mutations, prefer a post-settle DOM assertion over harness-coupled operation-variable assertions: assert the optimistic UI appears, wait for the mutation to settle, then assert the final user-visible state. A successful payload should preserve the committed UI; a rejected operation should roll it back. When using `queueOperationResolver` to test rollback, return an asynchronously rejected promise so the optimistic update is visible before the operation settles:
  ```ts
  environment.mock.queueOperationResolver(
    () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Update failed')), 0)
      }) as never,
  )
  ```
- `queueOperationResolver` may also return an asynchronously resolved promise. Use that when the test must observe both the optimistic state and a different server-confirmed state:
  ```ts
  environment.mock.queueOperationResolver(
    operation =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(MockPayloadGenerator.generate(operation, resolvers))
        }, 50)
      }) as never,
  )
  ```
- **Declarative mutation handlers run against the connection IDs in variables.** If a component passes `[mainConnectionId, ConnectionHandler.getConnectionID(task.id, 'Task_slots')]`, both IDs must exist in the mock store or Relay warns. Seed optional/secondary connections with `commitLocalUpdate` only when that connection ID is actually passed in mutation variables or appears in a concrete Relay warning; do not seed a connection merely because a fragment contains `@connection`.
- **Use the correct commit APIs.** `environment.commitPayload(operationDescriptor, payload)` requires an operation descriptor. To set up local records/connections with no operation, use `commitLocalUpdate(environment, updater)`. Do **not** call `environment.commitPayload({ data: { ... } })` or `environment.mock.getStore().commitPayload(...)`.
- **Read the generated `.graphql.ts` files before writing resolvers.** Confirm the exact root fields, connection keys, and whether the query/fragment requests `__id` on connections. If the generated file shows `ClientExtension` with `__id` on a connection, your resolver must return `__id` on that connection record.
- **Refetchable fragments cannot be unmasked with `@relay(mask: false)`.** If a story only needs a connection ID for a child mutation, write a small story query that selects the connection directly (`tasks(first: 20) @connection(key: "...") { __id edges { cursor node { id } } pageInfo { ... } }`) instead of spreading a refetchable fragment and casting.

## Step 6: Failure triage

When a validation command fails, do not speculate broadly. Fix the first concrete error with this order:

1. If the failure is `x is not defined` or `x.y is not a function`, inspect the failing source line and imports in that file first.
2. If a Testing Library query fails, inspect the rendered story/component only enough to confirm the role/name, then rerun the same targeted test.
3. If Relay warns or throws, inspect the generated operation and resolver type names before changing assertions or production code.
4. If the targeted test passes, stop investigating that failure. Do not read primitive components just to reconfirm accessible-name behavior.

---

## Step 7: Portal pitfalls

If the component renders into a portal, the **trigger** is inside the canvas but the **portaled content** is on `document.body`. Use the right scope for each:

```ts
// Trigger is in the canvas
await userEvent.click(canvas.getByRole('button', { name: /open menu/i }))

// Menu content is portaled — use `screen`
const item = await screen.findByRole('menuitem', { name: /delete/i })
await userEvent.click(item)

// Confirmation dialog is also portaled
await userEvent.click(await screen.findByRole('button', { name: /confirm/i }))
```

Common portaled components in this repo: `Popover`, `ConfirmDialog`, `Tooltip`, `Modal`.

---

## Step 8: Pick the right observation point — never invent test-only props

Before reaching for any spy, ask: **what is the observable behavior I want to verify?** Most interaction tests should assert against the DOM, because that is what users actually experience. Spies are a fallback for behavior that has no DOM consequence.

The hierarchy, in order of preference:

1. **DOM assertions.** The element exists, has focus, has a class, has `aria-selected="true"`, has the right text, scrolled into view. This is the highest-fidelity test — it verifies the user-visible outcome.
   ```ts
   await userEvent.keyboard('{ArrowDown}')
   expect((await screen.findAllByRole('option'))[0]).toHaveAttribute('aria-selected', 'true')
   ```

2. **Side-effect observation through the existing test harness.** For Relay-backed stories, the mock environment already records every operation — assert mutations fired by inspecting it, not by spying on a callback:
   ```ts
   const op = environment.mock.getMostRecentOperation()
   expect(op.fragment.node.name).toBe('AddTaskDropdownRoutineSlotMutation')
   expect(op.request.variables).toMatchObject({ taskId: 'pushups-id' })
   ```
   For toasts, query for the toast text. For navigation, assert the URL changed (or the new route's content rendered).

3. **`fn()` spy on a callback the component already accepts.** If the component genuinely has a prop like `onSelect` or `onClose` that exists for production reasons, declare it as `fn()` in `meta.args` and assert on calls:
   ```ts
   const meta = {
     title: 'WeeklyPlan/AddTaskDropdown',
     component: AddTaskDropdownStory,
     args: { onSelect: fn() },
   } satisfies Meta<typeof AddTaskDropdownStory>

   export const PicksATask: Story = {
     play: async ({ args, canvasElement }) => {
       const canvas = within(canvasElement)
       await userEvent.click(await canvas.findByRole('option', { name: /pushups/i }))
       expect(args.onSelect).toHaveBeenCalledTimes(1)
     },
   }
   ```
   `fn()` preserves the parameter types from the component's prop signature, so call assertions stay type-safe.

4. **Vitest module spying** (`vi.spyOn`, `vi.mock`). Reach for this only when there's no DOM signal and no callback to spy on — e.g., a fire-and-forget call into a utility module.

**Never** do this: add a new prop to the component just to hold a `fn()` spy. That changes the component's surface for testing reasons, which the codebase will then carry forever. If there's no existing prop and no DOM consequence, the behavior probably doesn't deserve a test at this layer — push it down to a unit test on the underlying function instead.

---

## Step 9: Non-story tests and escape hatches

This skill is for Storybook interaction tests. In this repo, **component interactions belong in Storybook `play` functions by default**: form submission, popovers, dialogs, Relay-backed component states, keyboard navigation, and visible optimistic UI should all be covered in `.stories.tsx` files.

Use standalone Vitest only when the behavior is not story-shaped:

- Pure functions and small helpers: `*.test.ts` in the `unit` project.
- Stores or browser APIs that need DOM globals but no rendered component, such as `localStorage`: add `// @vitest-environment jsdom` at the top of a `*.test.ts` file and keep the test focused on the store/helper.
- Provider/router/app flows that cannot be represented as a useful story: ask the user before adding new browser-test tooling or a new Vitest project.

Do **not** add `vitest-browser-react`, a second browser `integration` project, or standalone browser-rendered `*.test.tsx` component tests unless the user explicitly approves that architecture. If you think a component interaction cannot be expressed as a Storybook `play`, stop and explain why before changing tooling.

For auth/store-style tests, prefer simple Vitest assertions over rendered components. Example shape:

```ts
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { clearAccessToken, getAccessToken, setAccessToken } from './auth-store'

describe('auth-store', () => {
  beforeEach(() => {
    clearAccessToken()
    window.localStorage.clear()
  })

  it('writes tokens to localStorage', () => {
    setAccessToken('token')
    expect(window.localStorage.getItem('accessToken')).toBe('token')
    expect(getAccessToken()).toBe('token')
  })
})
```

---

## Step 10: Verify

- Use the repo CLI validation tools. In Pi, LSP/editor diagnostics are not available reliably, so do not spend turns trying to access them.
- If GraphQL in a story changed, run Relay first:
  ```
  pnpm --filter @my-routines/frontend relay
  ```
- Run the relevant Storybook interaction tests:
  ```
  pnpm --filter @my-routines/frontend test:storybook src/path/to/Foo.stories.tsx
  ```
- Run unit tests when you added or changed `*.test.ts` files:
  ```
  pnpm --filter @my-routines/frontend test:unit
  ```
- Run typecheck before declaring done:
  ```
  pnpm --filter @my-routines/frontend typecheck
  ```
- A green Storybook run produces one passing test per story export. A `play` failure shows the failed step in the Vitest output and, when Storybook is open, in the Interactions panel.
- If you see `The requested module '...storybook_test.js' does not provide an export named 'render'`, do **not** add another renderer. You are writing the wrong shape of test for this skill; convert it to a Storybook story/play or ask the user before introducing standalone browser test tooling.
- If you see `useToast must be used within a ToastProvider`, add the real provider to the story wrapper or use the existing Storybook decorators. Do not switch to a standalone render test just to add providers manually.
- If Relay compiler reports `Duplicate definitions for 'XQuery'`, rename the story query and update the corresponding generated-type import.
- If Relay reports `Warning: [Relay] The connection with id ... doesn't exist`, seed that connection in the story with `commitLocalUpdate`. Do not modify the component to omit connection IDs when the store is missing them.

---

## Step 11: Forbidden patterns (will cause silent failures)

- ❌ `useLazyLoadQuery(graphql\`query ... { ... @connection(...) }\`, {})` with no mock resolver that returns `__id` on the connection
- ❌ Casting `data as { tasks: { __id: string } }` without first reading the generated fragment to confirm `__id` is requested
- ❌ Passing a hardcoded `connectionId="test_connection"` to a component when the real code derives the ID via `ConnectionHandler.getConnectionID(parentId, key)` — these will never match unless the mock explicitly registers that exact ID
- ❌ Queueing a mutation resolver while ignoring the connection IDs the component sends in mutation variables
- ❌ Switching from `@relay_test_operation` to a custom root query "to avoid warnings" — warnings mean the mock is wrong, not the query
- ❌ Nesting resolver returns under the query root in `MockPayloadGenerator.generate(op, { ... })` — it maps by type name, not path
- ❌ Returning deeply nested root payloads from a type resolver, such as `WeeklySchedulePayload() { return { monday: { morning: { edges: [...] } } } }`. Use separate `WeeklySchedulePayload`, `DaySchedule`, `RoutineSlotConnection`, `RoutineSlotEdge`, `RoutineSlot`, and `Task` resolvers instead
- ❌ Changing production component logic to suppress mock-only Relay warnings, such as filtering `$connections` by `environment.getStore().getSource().get(connectionId)`
- ❌ Calling `environment.commitPayload({ data: ... })` or `environment.mock.getStore().commitPayload(...)`; use `environment.commitPayload(operation, payload)` or `commitLocalUpdate`
- ❌ Asserting exact text counts after optimistic create/append mutations unless optimistic and server IDs are intentionally the same
- ❌ Importing or adding `vitest-browser-react` for component interaction tests. Use Storybook `play` tests instead.
- ❌ Adding a new Vitest browser `integration` project without explicit user approval.
- ❌ Creating standalone browser-rendered component `*.test.tsx` files for interactions that fit in Storybook.
