---
name: interaction-test
description: Adds a Storybook `play` function (interaction test) to an existing story file. Use when asked to write tests for a Storybook story, add interactions, add a `play` function, or test a component through Storybook. Pairs with `relay-story` (which scaffolds the story); this skill adds the `play`.
---

Add an interaction test (`play` function) to the Storybook story at: $ARGUMENTS

If no path is provided, use the file currently open in the IDE.

## Project context

- Tests run via Vitest's Storybook project: `pnpm vitest --project=storybook` (real Chromium tab via Playwright, headless). Configured in `frontend/vitest.config.ts` and `frontend/.storybook/vitest.setup.ts`.
- Every story is already a smoke test by default. Adding a `play` upgrades it: assertion failures or failed interactions fail the story.
- `@storybook/addon-a11y` annotations are wired in, so accessibility violations also fail. Prefer accessible-name queries (`findByRole(name)`) — they double as a11y assertions.
- Stories using `createMockEnvironment` + `MockPayloadGenerator` (the `relay-story` pattern) need extra care: Suspense must resolve before interacting, and any user action that triggers a mutation or refetch needs another resolver queued upfront in the story setup.

## Step 1: Read the story and the component

Read the story file and the component it renders. Identify:

- The story exports that should get a `play` (typically `Default`, plus any variants the user named).
- Whether the story uses a **mock Relay environment** (`createMockEnvironment`, `MockPayloadGenerator.generate`) or renders against a real one.
- Whether the component renders into a **portal** — search the component (and its children) for any of: `Popover`, `PopoverContent`, `Modal`, `ConfirmDialog`, `Tooltip`, `Dialog`, or a direct `createPortal` call. Portaled content is attached to `document.body`, not the story's canvas, and `within(canvasElement)` will not find it.
- Mutations and refetches the user can trigger from the rendered UI. Each one consumes a queued `MockPayloadGenerator` resolver — the story author needs to queue enough.
- Any `args` callbacks worth asserting (e.g., `onSelect`, `onClose`). Mark these as `fn()` in `meta.args` so the `play` can assert on them.

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

## Step 3: Query priority

Match Testing Library's recommended order. Higher = better:

1. `findByRole(role, { name })` — accessible role + name. First choice.
2. `findByLabelText` — form fields with associated labels.
3. `findByPlaceholderText` — only if no label exists.
4. `findByText` — non-interactive copy.
5. `findByDisplayValue` — current value of an input.
6. `findByTestId` — last resort. Only add a `data-testid` when nothing semantic fits, and prefer fixing the component's accessibility instead.

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

## Step 5: Mock-Relay pitfalls

For stories built on `createMockEnvironment` + `MockPayloadGenerator`:

- **Wait for Suspense before interacting.** The first `findBy*` after mount handles this naturally; don't use `getBy*` immediately after the story renders.
- **Queue extra resolvers in the story setup, not the play.** Every operation the `play` will trigger needs its own queued resolver — `environment.mock.queueOperationResolver(op => MockPayloadGenerator.generate(op))` is consumed once per operation. The story already queues the initial query; add one resolver per mutation, refetch, or follow-up query the play will fire. If the resolvers run out, Relay throws.
- **Mock data is deterministic but ugly.** Default fields look like `"<mock-value-for-field-\"title\">"`. Either match against those literal strings (fine for assertions you don't read) or pass a custom resolver in the story setup that returns realistic values for the fields the play asserts on:
  ```ts
  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      Task: () => ({ title: 'Pushups', icon: 'dumbbell' }),
    }),
  )
  ```
- **Optimistic updates land synchronously**, so you can assert on them with `findBy*` (which still works since `findBy*` polls). The mutation completion that follows consumes the next queued resolver.

## Step 6: Portal pitfalls

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

## Step 7: Pick the right observation point — never invent test-only props

Before reaching for any spy, ask: **what is the observable behavior I want to verify?** Most interaction tests should assert against the DOM, because that is what users actually experience. Spies are a fallback for behavior that has no DOM consequence.

**The hierarchy, in order of preference:**

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

4. **Vitest module spying** (`vi.spyOn`, `vi.mock`). Reach for this only when there's no DOM signal and no callback to spy on — e.g., a fire-and-forget call into a utility module. See "Vitest spying machinery" below for the mechanics and caveats.

**Never** do this: add a new prop to the component just to hold a `fn()` spy. That changes the component's surface for testing reasons, which the codebase will then carry forever. If there's no existing prop and no DOM consequence, the behavior probably doesn't deserve a test at this layer — push it down to a unit test on the underlying function instead.

### Vitest spying machinery

Available from `'storybook/test'` (which re-exports Vitest's spy APIs alongside the testing-library helpers):

- **`vi.spyOn(object, methodName)`** — wraps an existing method, lets you observe calls and optionally `.mockReturnValue(...)`. Works on:
  - Object methods: `vi.spyOn(window, 'scrollTo')`, `vi.spyOn(console, 'error')`.
  - Browser APIs: `vi.spyOn(window.navigator.clipboard, 'writeText')`.
  - Module namespaces — only if the consumer imports as a namespace (`import * as icons from './icons'` then calls `icons.iconComponent(...)`). Direct named imports (`import { iconComponent }`) are **immutable ESM bindings** and can't be patched after the fact; the spy won't be observed by code that imported the name directly.
  Always restore in teardown: `vi.restoreAllMocks()` in a `beforeEach` or wrap in `afterEach`. In `play` functions specifically, the story remounts fresh per test, so cross-test leakage is rare — but spies on global objects (`window`, `document`) do persist and need explicit cleanup.

- **`vi.mock(modulePath, factory)`** — replaces an entire module before any imports resolve. Hoisted to the top of the file by Vitest's transform. Use for replacing a heavy dependency (e.g., a real network client) with a stub:
  ```ts
  vi.mock('../utils/analytics', () => ({
    track: vi.fn(),
  }))
  ```
  Caveats: only works at file scope (not inside a `play`), affects every test in the file, and the mocked path must match exactly. Not appropriate for per-story behavior — if different stories need different stubs, prefer `vi.spyOn` with `.mockReturnValueOnce(...)`.

- **`vi.fn()`** — a free-standing spy. Use for synthetic callbacks in tests (`const handler = vi.fn(); element.addEventListener('click', handler)`). For Storybook `args` callbacks, prefer `fn()` from `'storybook/test'` — it does the same thing but also feeds the Actions panel.

- **`vi.stubGlobal(name, value)` / `vi.unstubAllGlobals()`** — replace a global like `fetch` or `crypto.randomUUID` for the duration of a test. The optimistic-response code in `AddTaskDropdown.tsx` calls `crypto.randomUUID()`; if a test wanted deterministic optimistic IDs, this is how:
  ```ts
  vi.stubGlobal('crypto', { ...crypto, randomUUID: () => 'fixed-id' })
  ```

**Caveats specific to this repo's setup:**

- The `storybook` Vitest project runs in a **real Chromium tab via Playwright**, not jsdom or node. `vi.useFakeTimers()` works but interferes with real CSS transitions and `findBy*` polling — avoid unless you really need it. Prefer `findBy*`/`waitFor` over fake timers.
- `vi.mock` factories run before module evaluation in the worker, but Storybook's portable-stories pipeline can reorder things; if a `vi.mock` doesn't take effect, move it to a Vitest setup file (`.storybook/vitest.setup.ts`) instead of the story file.
- Spies on imports inside the **component under test** are usually a smell — by the time you need them, the component is doing too much. Push the side effect down into a smaller module and unit-test that directly with `vi.spyOn`, leaving the story to assert DOM only.

## Step 8: Verify

- Check LSP diagnostics on the story file. Resolve type errors before declaring done — silent type errors in story files are easy to miss because Storybook itself runs through esbuild.
- Ask the user to run the test (or run it yourself if you have permission):
  ```
  pnpm --filter @my-routines/frontend vitest --project=storybook run src/path/to/Foo.stories
  ```
- A green run produces one passing test per story export. A `play` failure shows the failed step in the Vitest output and (if the user opens Storybook) in the Interactions panel.

## Anti-patterns — do not do these

- ❌ `import { userEvent } from '@testing-library/user-event'` (or `@testing-library/react`, or `@storybook/test`). Always `'storybook/test'`.
- ❌ Hard-coded waits (`await new Promise(r => setTimeout(r, 500))`). Use `findBy*` or `waitFor` with a condition.
- ❌ `getBy*` immediately after mounting a Relay-backed story — Suspense is still pending; the element doesn't exist yet.
- ❌ `within(canvasElement).getByRole(...)` for popover/modal/tooltip content — those live on `document.body`. Use `screen`.
- ❌ Adding `data-testid` when an accessible name would work. The a11y addon will eventually flag the missing name anyway.
- ❌ `vi.fn()` in story args — use `fn()` from `'storybook/test'`. The Storybook one is wired into the Actions panel.
- ❌ Asserting against multi-line stringified mock data without a custom resolver. Brittle and unreadable; use `MockPayloadGenerator.generate(op, { Task: () => ({...}) })` in the story to control values.
- ❌ Forgetting to queue an extra mock resolver for a mutation the play triggers. Symptom: the story passes manually in Storybook UI but the `play` hangs or throws "no operation resolver queued".
- ❌ Adding a new prop to the component just so the test can pass `fn()` to it. If the prop doesn't exist for a real reason, find a different observation point (DOM, mock environment, or push the test down a layer).
