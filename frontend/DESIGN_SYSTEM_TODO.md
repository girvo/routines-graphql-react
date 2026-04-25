# Design System — Component Build List

Tracks the build-out of primitives and composites driven from the Penpot design. Items move to Done as they ship; ongoing-process notes live at the bottom.

## Primitives (done)

Atomic primitives in `src/primitives/`. All wired to tokens + typography role classes. Storybook stories live under `src/stories/primitives/` mirroring the source folder.

- `Button` — `primary | secondary | ghost | destructive`, `sm | md`, leading/trailing icon, `iconOnly` variant (discriminated union with required `aria-label`), `loading`, `fullWidth`. Forwards refs (so it can be a `PopoverTrigger` child).
- `TextInput` — `bordered | filled | ghost`, `sm | md`, leading/trailing icon, `error?: boolean`, `type` prop (`text | email | password | search | tel | url`), `forwardRef`, RHF-compatible.
- `CheckBox` — `sm | md`, accessible label enforcement via discriminated union. `onChange(checked: boolean)` value-based API.
- `Field` — wrapper providing `label` + control + `hint` + `error`. Auto-generates `id`, `aria-describedby`, `aria-invalid`. `hideLabel` for visually-hidden labels.
- `Alert` — inline persistent status message (`error | success | warning | info`) with optional title.
- `Toast` — tinted surface + 3px left accent border keyed by type, status icon, optional icon-only ghost dismiss.
- `Modal` + `ConfirmDialog` — portal-rendered, `--overlay-scrim` backdrop, Escape + backdrop-click dismiss, focus-return on close. `ConfirmDialog` is a thin wrapper (title/body/cancel/confirm + `destructive?` + `loading?`).
- `Popover` — hand-rolled (zero deps). `<Popover>` + `<PopoverTrigger>` + `<PopoverContent>`, four placements, viewport flip + horizontal shift, portal, escape/outside-click dismiss, focus-return. Controlled + uncontrolled.
- `IconChip` — `sm | md`, non-interactive icon container.
- `SlotChip` — section + count pill, filled/ghost variants.
- `DayChip` — day-of-week pill, selected/unselected, interactive button with `aria-pressed`.
- `CountBadge` — small mono numeric label (currently styled text — no badge bg/pill in design).
- `NavItem` — icon + label + optional `CountBadge`, active/inactive, `aria-current`.
- `Divider` — horizontal hairline using `--stroke-hairline`, optional `inset`.
- `Avatar` — 26×26 initials square, `--surface-avatar-bg`, `--radius-control` (7px).
- Text primitives: `Title`, `Heading`, `Body`, `Meta`, `Label`, `Mono`.

`SearchBar` was considered but rejected — `<TextInput variant="filled" leadingIcon={Search} />` covers it. Use `TextInput` directly; put `role="search"` on the surrounding form.

## Shell composites (done)

Live under `src/shell/`. Shell-level = app chrome (frame + nav + topbar), not page content.

- `AppShellFrame` — slot-based frame (`sidebar` / `topBar` / `belowHeader` / `dock` / `children`), responsive at 1024px (sidebar ≥lg, dock <lg), 1px `--stroke-line` divider between sidebar and content.
- `DesktopSidebar` — brand + primary nav (Today/Weekly/Tasks) + divider + secondary nav (Settings/Logout) + spacer + inline `UserCard`. Takes `user` + `onLogout` as props.
- `TopBar` — title + optional subtitle + free-form `actions: ReactNode` slot + overflow menu (Popover with Settings/Logout, hidden ≥lg). Used at every breakpoint.
- `MobileDock` — bottom tab bar (NavLink per route), iOS safe-area-aware (`env(safe-area-inset-bottom)`).
- `DateNavigator` — three-button date trio (`[‹] [Today] [›]`) ≥lg, compact `☀️ Apr 22` pill on mobile. For Today page header.

### Page header API

Pages drive the TopBar via `usePageHeader({ subtitle?, actions?, belowHeader? })` (`src/utils/page-header.ts`). All three slots take free-form `ReactNode`:

- `subtitle` — appears under the title in the TopBar. Falls back to `route.handle.subtitle`.
- `actions` — rendered in the TopBar trailing slot at every breakpoint. Page is responsible for any responsive show/hide on the children.
- `belowHeader` — optional row between TopBar and main content (e.g. mobile-only full-width search bar).

`HeaderAction[]` descriptor type and the old `useHeaderActions` / `useHeaderSubtitle` hooks were removed during the refactor — pages compose JSX directly.

`AppShell.tsx` reads `title` from route handle, sources placeholder user data (until `me` query lands — see QUESTIONS).

## Page composites (done)

Page-level = content composites used inside `<main>`. Built responsively, not as mobile/desktop pairs.

- **PlannerSlot** (`src/WeeklyPlan/PlannerSlot.tsx`) — icon + label row. 46h on mobile, 36h inside PlannerCard on desktop.
- **PlannerCard** — responsive card wrapper inline in `DaySection.module.css`: flat on mobile, bordered card with hairlined rows on desktop. Standalone `PlannerCard.tsx` exists for reuse if a `header + divider + body` wrapper is needed.
- **SectionHeader** — uppercase label + mono count + optional action. `dense` prop for card-header (46h) vs flat (42h).
- **TaskCard** (`src/Tasks/TaskCard.tsx`) — desktop column layout: icon + title + per-section `SlotChip`s + plain numeric slot count + edit/delete icon buttons; mobile flat layout: icon + title with section chips below + overflow menu. Section chips render one per `DaySection` the task is used in (`MORNING`/`MIDDAY`/`EVENING`), in deterministic order.
- **TasksTableHeader** — column header row (`TASK | USED IN | SLOTS`) on desktop, hidden on mobile.
- **WeekDaySelector** — desktop vertical tabs with day name + task count, `aria-current` on active.
- **AddTaskRow** — dashed plus-box + "Add task" row. Built but not yet wired (intended as the mobile-Weekly trigger).

### Tasks page redesign (2026-04-25)

- Wraps the list in a bordered Card with a column header row on desktop; flat surface with hairline rows on mobile.
- "+ New task" primary button + filled "Search tasks" input pushed via `usePageHeader({ actions, belowHeader })`. Desktop: button + search inline in the TopBar trailing area. Mobile: button alone in TopBar, search becomes a full-width row below the TopBar via `belowHeader`.
- Subtitle "N total" pushed dynamically from `TasksList`.
- Inline create row: icon placeholder + title `Field` + icon `Field` + em-dash slots cell + Cancel/Save buttons. Mobile collapses to a 2-row grid (title row + icon row), Cancel hidden, accent left-border indicates active state.
- Per-section `SlotChip` array driven by a new `sectionCounts()` util that groups slot edges by `DaySection` (forward-compat-tolerant).

### Auth migration (2026-04-25)

- `Login.tsx` and `Register.tsx` collapsed into a shared `AuthForm` composite (`src/login/AuthForm.tsx`). Each page is ~15 lines wiring title/endpoint/success behaviour.
- `AuthForm.module.css` shrank from 166 lines to ~48 (page-centring + card shell + footer link).
- Network errors render via `Alert`. Validation hints render via `Field`.

## Outstanding

- [ ] **TaskRow** (checkbox + title + meta for the Today page) — Today is still a stub. Build alongside the Today page.
- [ ] **Mobile Weekly day selector** — horizontal `DayChip` strip from the mobile design. Currently placeholder ChevronLeft/Right buttons.

## Folder conventions

`src/primitives/` mixes two shapes:

- **Flat `Foo.tsx`** — atomic primitives. One styled element (or tight wrapper around one), one file.
- **Lowercase folder `foo/`** — used when a primitive ships as multiple files that only make sense together:
  1. **Themed set** — sibling components sharing a concept (e.g. `text/` → Title, Heading, Body, Meta, Label, Mono).
  2. **Compound unit** — a single primitive whose internals span multiple files (e.g. `popover/` → `Popover.tsx`, `helpers.ts`, `Popover.test.ts`, `Popover.module.css`; `modal/` → `Modal.tsx`, `ConfirmDialog.tsx`, `Modal.module.css`).

Files inside folders keep PascalCase. Triggers for promoting flat → folder: a helpers file appears (often forced by `react-refresh/only-export-components`), a co-located test appears, or a sub-component is added that only serves it.

## Process per primitive

1. Pull spec from Penpot via MCP (`high_level_overview` → `execute_code` for styles, `export_shape` for reference PNG).
2. Build in `src/primitives/` using existing tokens + typography role classes. Flag missing tokens in `DESIGN_SYSTEM_QUESTIONS.md` rather than inventing one-offs.
3. Add Storybook story under `src/stories/primitives/` mirroring the source folder.
4. Update this file — move the item to Done.
