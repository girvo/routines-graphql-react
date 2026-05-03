# Frontend Architecture Review

Surveyed 168 files. Below is what's worth actioning, ordered by impact. Stylistic nits and false alarms have been pruned.

## High-impact

### 1. Optimistic updates are inconsistent across sister mutations
- Have them: [EditTask.tsx:65-79](frontend/src/Tasks/EditTask.tsx#L65-L79), [TodayTaskRow.tsx:75-96](frontend/src/Today/TodayTaskRow.tsx#L75-L96)
- Don't: CreateTask, [Task.tsx](frontend/src/Tasks/Task.tsx) delete, [RoutineSlotItem.tsx:77-86](frontend/src/WeeklyPlan/RoutineSlotItem.tsx#L77-L86), [AddTaskDropdown.tsx:171-181](frontend/src/WeeklyPlan/AddTaskDropdown.tsx#L171-L181)

**Policy**: every mutation gets an optimistic update. Submit handlers close their dialog/inline-edit immediately and rely on Relay's automatic revert + a toast for failures.

Implementation per mutation type:

- **Field updates** (no connection churn): `optimisticUpdater` + `store.readUpdatableFragment` against an `@updatable` fragment. EditTask is the reference pattern.
- **Creates** with `@appendEdge`/`@prependEdge`: provide a full `optimisticResponse` matching the mutation shape. Stub edge with `cursor: ''` and a `node` carrying every field consumed by downstream fragment spreads, plus a placeholder id (`client:Task:${crypto.randomUUID()}`). The declarative directive applies the connection insert automatically — no `ConnectionHandler` needed. Real id reconciles on commit.
- **Deletes** with `@deleteEdge`: trivial `optimisticResponse` containing the known `deletedId`. Directive handles the rest.
- **Imperative `optimisticUpdater` + `ConnectionHandler`**: only when the change can't be expressed as one declarative payload (e.g. one mutation feeding multiple connections with different filters, or a server-computed field we can't guess). Don't reach for it otherwise.

Gotcha for creates: the optimistic node must cover every field any spread fragment reads, or Relay logs warnings and the row flashes incomplete data. Part of the work in each migration is auditing the fragment surface.

### 2. `max-width` media query violation
[Tasks/TasksTableHeader.module.css:37](frontend/src/Tasks/TasksTableHeader.module.css#L37) — `@media (max-width: 1023px)` hides the header on mobile. Project rule is mobile-first only. Invert: keep `display: none` as base, add `@media (min-width: 1024px) { display: flex }`.

(Other `max-width:` hits — Modal, Toast, AppError, AuthForm — are element width caps, not media queries. Those are fine.)

### 3. `getAccessToken` reaches into a private field
[auth/auth-store.ts:65-67](frontend/src/auth/auth-store.ts#L65-L67) — `authStore['accessToken']` bypasses the `private` modifier. TS won't catch a rename. Add a public `getAccessToken = () => this.accessToken` method on the class and call that.

## Medium-impact

### 4. Search/refetch pattern is duplicated, not abstracted
[AddTaskDropdown.tsx:42-75](frontend/src/WeeklyPlan/AddTaskDropdown.tsx#L42-L75) implements debounced search → `refetch` + `useTransition` from scratch. If a second searchable list shows up, this should become `useRefetchableSearch(fragmentRef, key)`. Note now so we don't paste it.

### 5. `AppError`/`RouteErrorBoundary` is the only error boundary
[main.tsx:15](frontend/src/main.tsx#L15) and [routes.tsx](frontend/src/routes.tsx) wrap the root and each route. Suspense boundaries inside pages (e.g. [DesktopSidebar.tsx:124](frontend/src/shell/DesktopSidebar.tsx#L124)) have no nested error boundary, so a fragment fetch failure in the sidebar takes down the whole route. Decide whether that's acceptable; if not, a small `<SuspenseWithError>` primitive solves it everywhere.

### 6. Text primitives exist but are bypassed
[primitives/text/](frontend/src/primitives/text/) (Body, Title, Heading, Label, Mono, Meta) — barely used. Consumers compose `typo-*` classes directly via CSS modules. That's fine *as a choice*, but then the primitives are dead weight. Either start using them in new code (and migrate) or delete the unused ones. Currently we pay the cost (stories, types, maintenance) without the benefit.

### 7. Card styling diverges across features
[Tasks/TasksList.module.css](frontend/src/Tasks/TasksList.module.css), [WeeklyPlan/PlannerCard.module.css](frontend/src/WeeklyPlan/PlannerCard.module.css), [Today/TodaySection.module.css](frontend/src/Today/TodaySection.module.css), [AppError.module.css](frontend/src/AppError.module.css) — each rolls its own card surface (border, radius, padding) instead of using [primitives/layout/Card.tsx](frontend/src/primitives/layout/Card.tsx). Worth one focused PR to unify, otherwise visual drift is guaranteed.

### 8. Recurring hardcoded layout values
`18px` gap repeats across [WeeklyPlanPage.module.css:41](frontend/src/WeeklyPlan/WeeklyPlanPage.module.css#L41), [WeeklyPlanDay.module.css:12](frontend/src/WeeklyPlan/WeeklyPlanDay.module.css#L12), and others — falls between `--space-3` (12px), `--space-4` (16px), and `--space-5` (20px). Either add a token (`--space-section-gap`) or pick the nearest scale value; right now it's a one-off that will get copied.

## Low / FYI

- **Fragment naming**: most fragments use `Fragment_field` form; [WeeklyPlan/WeeklyPlanRoutineSection.tsx:19](frontend/src/WeeklyPlan/WeeklyPlanRoutineSection.tsx#L19) spreads `...RoutineSlotItem` (parent-field hint missing). Cosmetic but worth standardising.
- **`usePageHeader` adoption**: TasksPage and TodayPage use it; WeeklyPlan doesn't. If the pattern is the standard, fix WeeklyPlan; if it's not, document why.
- **EntryPoint URL params**: only [TodayPage.entrypoint.ts](frontend/src/Today/TodayPage.entrypoint.ts) reads from the URL. That's correct — only Today is parameterised — so this is *not* an inconsistency.
- **Token in localStorage**: standard tradeoff, not a regression. Known item, not an action.

---

**Suggested action order:** 2 → 3 (small, clearly correct fixes), then 1 (decide policy on optimistic updates), then 7 (Card unification) as one focused PR. The rest can be opportunistic.
