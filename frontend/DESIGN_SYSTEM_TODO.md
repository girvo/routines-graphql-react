# Design System — Component Build List

Primitives to build out from the Penpot design, before any "real" app components (TaskRow, PlannerSlot, etc.). Work top-down; keep each primitive self-contained with a Storybook story.

## Done

- `Button` — primary / secondary / ghost, sm/md, icon support, loading state
- `CheckBox` — sm/md, accessible label enforcement via discriminated union
- `IconChip` — sm/md, non-interactive icon container
- `TextInput` — bordered / filled / ghost, sm/md, forwardRef, RHF-compatible
- Text primitives: `Title`, `Heading`, `Body`, `Meta`, `Label`, `Mono`
- `SlotChip` — section + count pill, filled/ghost variants (also covers Penpot's UsagePill — they were byte-identical duplicates)
- `DayChip` — day-of-week pill, selected/unselected, interactive button with `aria-pressed`
- `CountBadge` — small mono numeric label (currently just styled text — no badge bg/pill in design)
- `NavItem` — icon + label + optional CountBadge row, active/inactive, `aria-current`
- `Divider` — horizontal hairline using `--stroke-hairline`, with optional `inset` (vertical dropped — no design usage)
- `Avatar` — 26×26 initials square, uses `--surface-avatar-bg` (radius 8px — 1px divergence from design's 7, same as NavItem)
- `Button` icon-only variant — discriminated union (`iconOnly` + required `aria-label`), square 28×28 geometry
- `Popover` — hand-rolled (zero deps). `<Popover>` + `<PopoverTrigger>` + `<PopoverContent>`, placements `bottom-start | bottom-end | top-start | top-end`, viewport flip + horizontal shift, portal-rendered, escape/outside-click dismiss, focus returns to trigger. Controlled + uncontrolled both supported.

SearchBar was considered but rejected — it's just `<TextInput variant="filled" leadingIcon={Search} />` with a preset placeholder. Use TextInput directly at the call site; put `role="search"` on the surrounding form.

## Composites (next)

All atomic primitives are complete. Composites to build (in order — start with the smallest/most-reused):

- [ ] **PlannerSlot** — 46px row with icon-chip + label (planner rows on Today/Weekly)
- [ ] **TaskRow** — checkbox + title + meta row (from Today/Weekly pages)
- [ ] **TaskCard** — card with icon-chip + title column + overflow menu (Tasks page)
- [ ] **SectionHeader** / **PlannerSectionHeader** — small headers for time-section groupings
- [ ] **AddTaskRow** / **InlineCreateRow** — inline create affordance
- [ ] **Dock** (mobile bottom tabs)
- [ ] **DesktopSidebar** (nav rail) — composes NavItem + brand + user chip
- [ ] **TopBar** / **DesktopTopBar**
- [ ] Weekly day selector — composes DayChip

## Open design questions to resolve during composite work

Composites will stress-test assumptions the atomic primitives sidestepped. See `DESIGN_SYSTEM_QUESTIONS.md` — pay particular attention to:
- Input height tokens (still hardcoded in TextInput)
- Half-pixel font rounding — TextInput shipped at 13 (`typo-md`) but the rounding pattern we settled on is 13.5→14. Revisit before more primitives compose it.
- Space scale extension (32/40/48 stops missing)
- Surface-grey consolidation (5 near-identical greys still in `tokens.css`)
- Icon size scale (12/14 CheckBox checkmarks still hardcoded)

## Folder conventions

`src/primitives/` mixes two shapes. Pick based on what the primitive actually is:

- **Flat `Foo.tsx`** — atomic primitives. One styled element (or tight wrapper around one), one file. Most things: Button, Divider, Avatar, CheckBox, TextInput, DayChip, etc.
- **Lowercase folder `foo/`** — used when a primitive ships as multiple files that only make sense together. Two reasons to reach for this:
  1. **Themed set**: several small sibling components that share a concept (e.g. `text/` → Title, Heading, Body, Meta, Label, Mono).
  2. **Compound unit**: a single primitive whose internals span multiple files — component + helpers + co-located test (e.g. `popover/` → `Popover.tsx`, `helpers.ts`, `Popover.test.ts`, `Popover.module.css`).

Files inside folders keep PascalCase (`Popover.tsx`) — the folder name is a namespace, the filename is the component. Import reads as `primitives/popover/Popover.tsx`.

Triggers for promoting a flat primitive into its own folder:
- It grows a helpers file (commonly forced by `react-refresh/only-export-components` when non-component exports appear).
- It grows a co-located test.
- It grows sub-components that only exist to serve it (e.g. a future `Menu` built on `Popover` would live in `popover/` or its own `menu/`).

If none of those apply, keep it flat. Don't preemptively wrap a one-file primitive in a folder.

## Process per primitive

1. Pull spec from Penpot via MCP (`high_level_overview` → `execute_code` for styles, `export_shape` for reference PNG).
2. Build primitive in `src/primitives/` using existing tokens + typography role classes. Flag missing tokens in `DESIGN_SYSTEM_QUESTIONS.md` rather than inventing one-offs.
3. Add Storybook story under `src/stories/primitives/` mirroring the source folder.
4. Update this file — move the item to Done.
