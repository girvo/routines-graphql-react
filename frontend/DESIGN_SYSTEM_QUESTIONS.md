# Design System — Open Questions

Running list of decisions deferred while building out primitives from the Penpot design. Resolved questions are kept here as a record so the rationale doesn't disappear.

## Open

### Large CTA control height (40px tier?)

`--control-h-sm: 28px`, `--control-h-md: 32px`, `--control-h-lg: 36px`. No 40px tier. Login submit button + mobile touch targets are the canonical justifications. Defer until a real need surfaces.

### Typography token naming

`--fs-xs..3xl` follows t-shirt sizing. If the scale grows we might want numeric (`--fs-11..20`) or role-based (`--fs-body`, `--fs-title`) instead. Deferred — revisit once more primitives land.

## Conventions / decisions documented

### Primitive event API: value-based vs native-event

- `CheckBox` uses `onChange: (checked: boolean) => void` (value-based, since native checkbox change event is awkward and RHF `register` isn't typically used for checkboxes).
- `TextInput` uses native `onChange: ChangeEventHandler<HTMLInputElement>` (so `{...register('title')}` from react-hook-form just works).

Inconsistent but intentional. **Convention**: value-based for controls where the native event is clumsy; native-event for inputs that'll pair with form libraries.

## Resolved

### `me` Relay query for DesktopSidebar (resolved 2026-04-25)

`AppShell` now drives an `AppShellMeQuery` via `useQueryLoader` + Suspense. `DesktopSidebar` consumes a `DesktopSidebar_me` fragment via `useFragment`. `placeholderUser` is gone. `AuthContext` stays scoped to the token.

**Schema additions:** `User.name: String!` and `User.initials: String!`. Persisted via a migration that adds a `name varchar NOT NULL DEFAULT ''` column to `users` (existing dev rows backfilled to `email` as a placeholder). `createUser` now requires a name; signup splits its arktype schema into `LoginSchema` (email + password) and `SignupSchema` (email + name + password). The frontend `AuthForm` takes a `withName` prop to swap the schema and render a Name field; `Register` opts in.

`name` is read directly from the column. `initials` is derived in a `User` field resolver via `deriveInitials(name)` (split on whitespace, first letter of up to two parts, uppercase) — derivation is fine here because initials are purely presentational and always reproducible from name.

`DesktopSidebar.stories.tsx` rewritten to use `relay-test-utils` `MockPayloadGenerator` (matches `Task.stories.tsx` pattern).

### Icon size scale — left as 16/20 (resolved 2026-04-25)

Audited every `var(--icon-*)` and raw size in `src/`. Scale is exclusively `--icon-sm: 16` and `--icon-md: 20`, used uniformly across 16+ callsites. The only off-scale values are the CheckBox checkmark glyphs (12 / 14), which are glyphs *inside* a fixed-size control — analogous to the 22/18 box sizes already documented as deliberately not-tokenized in the space-scale resolution. Introducing `--icon-xs: 12`/`--icon-sm: 14` would force renames across every callsite for values used in exactly one component. **Decision:** leave checkmark 12/14 inline; do not bump the icon scale.

### Retired `--control-h` / `--control-padding-x` aliases (resolved 2026-04-25)

`--control-padding-x` had zero callsites; deleted outright. `--control-h` had one callsite (`IconChip.sm`) — migrated to `--control-h-sm` and deleted the alias. Note: the alias actually pointed to `-sm`, not `-md` as the question record claimed; result is identical. Build clean.

### Surface greys collapsed 5 → 3 (resolved 2026-04-25)

- `--surface-table-head` (#fafafa) deleted; `TasksTableHeader` now uses `--surface-bg` (byte-identical).
- `--surface-inline-create` (#fcfcff) deleted; `CreateTask` now uses `--surface-bg-soft` (#fcfcfc — the 1-channel blue tint was imperceptible, likely a Penpot artefact).
- Kept: `--surface-bg` (#fafafa), `--surface-bg-soft` (#fcfcfc), `--surface-avatar-bg` (#e8e8e8 — visibly distinct, used by Avatar + secondary Button hover).
- `Colors.stories.tsx` updated.

### `--border-width-md` reverted to inline (resolved 2026-04-25)

Only CheckBox used it. Token deleted from `tokens.css`; `CheckBox.module.css` now uses inline `1.5px`. If a second control later wants the same value, promote it back.

### Stroke greys in Colors story (resolved 2026-04-25)

Added `--stroke-line-medium` and `--stroke-line-strong` chips to the Stroke group in `Colors.stories.tsx`.

### TextInput font size (resolved 2026-04-25)

Bumped `.input` from `typo-md` (13) to `typo-lg` (14) per the half-pixel round-up rule. No other primitive depends on TextInput's font size — the class is self-contained.

### Space scale (resolved 2026-04-24)

Stay on the 4-pt `--space-1..6` scale. Refused to codify off-scale values into generic tokens. Added one pragmatic half-stop and two semantic tokens, based on an audit of every `*.module.css` under `src/`:

- **`--space-2-5: 10px`** — only genuine hole in the 4-pt scale (16 uses as row/page vertical padding and inter-item gap). Hyphen, not underscore.
- **`--avatar-sm: 26px`** — replaced 10 raw uses across Avatar, PlannerSlot, AddTaskRow, TaskCard, DesktopSidebar. Component dimension promoted because it recurred.
- **`--outline-width: 2px` / `--outline-offset: 2px`** — replaced ~27 raw uses across focusable components. Negative offset uses `calc(-1 * var(--outline-offset))`.

Promoted existing raw uses to tokens: `32`/`36` control heights → `--control-h-md`/`--control-h-lg`; `20` icon → `--icon-md`; `6` control gap → `--control-gap`; `4` → `--space-1`; `12` → `--space-3` where it was spacing.

Explicitly **not** tokenized: CheckBox internals (22/18/14/12), TaskCard mobile dims, SlotChip min-width, SectionHeader min-height, TopBar height/padding, WeekDaySelector internals, `gap: 18px` in WeeklyPlanPage card bodies, `box-shadow` offsets.

Rejected: full rename to a 2-pt numeric scale (token = px value). Audit showed off-scale noise was dominated by component dimensions and focus-ring values, not generic spacing — renaming every `--space-N` callsite would pay 100% of the churn to fix ~30% of the problem.

### Control heights (resolved 2026-04-25)

Unified scale in `tokens.css`:
- `--control-h-sm: 28px` — Button `sm`, IconChip `sm`, TextInput `sm`
- `--control-h-md: 32px` — Button `md` (default), IconChip `md`
- `--control-h-lg: 36px` — TextInput `md` (default), DesktopSidebar nav item

Horizontal padding split: `--control-padding-x-sm: 10px`, `--control-padding-x-md: 12px`.

CheckBox uses 22/18 fixed (not on the control scale).

### Control radius (resolved 2026-04-25)

Single token: `--radius-control: 7px`. Used by every interactive control: Button, TextInput, IconChip, Avatar, NavItem, DesktopSidebar items, TaskCard `.iconBtn`, TopBar `.menuItem`, WeekDaySelector `.day`, AddTaskRow, DayChip, CheckBox label.

Old `--control-radius: 8px` token removed; everything collapsed to 7px to match Penpot specs.

Other radius tokens still in use:
- `--radius-sm: 4px` — CheckBox inner check
- `--radius-md: 6px` — small elevated surfaces (Popover, Alert, Toast, AddTaskDropdown content)
- `--radius-lg: 12px` — large cards (Card, Modal, PlannerCard, WeekDaySelector, DaySection)
- `--radius-pill: 999px` — DayChip, SlotChip, sectionChip, dot indicators

### Typography (resolved 2026-04-21)

`typography.css` is composition-based. Semantic-but-identical classes were removed: *semantic meaning in CSS class names isn't useful — that's what component prop names are for.* Primitives compose role + size + (optional) weight/letter-spacing utility classes via `clsx` or CSS Modules `composes`.

Roles (each declares font-weight, letter-spacing, default font-size): `typo-title`, `typo-body`, `typo-label`, `typo-label-tight`, `typo-button`, `typo-tab`, `typo-brand`, `typo-mono`.

Removed (collapsed into role + size composition): `typo-heading` (= title at xl), `typo-meta` (= body at smaller sizes), `typo-chip`, `typo-status`, `typo-body-strong-sm`, `typo-meta-strong-sm`, plus 9 unused classes.

Utility classes: `typo-{xs..3xl}` (size), `typo-{regular,medium,semibold,bold}` (weight), `typo-ls-{tight-sm,tight-md,wide-xs,wide-sm,wide-md,wide-lg}` (letter-spacing). Sizes declared *after* roles so they win at equal specificity. Compound selectors like `.typo-title.typo-xl` handle role+size couplings.

### Half-pixel font sizes (resolved 2026-04-24)

Penpot exports show half-pixel sizes. Treated as Penpot artefacts and rounded UP to the nearest value on our scale:
- 10.5 → 11 (`--fs-xs`) — SlotChip count
- 11.5 → 12 (`--fs-sm`) — SlotChip section label
- 12.5 → 13 (`--fs-md`) — DayChip label
- 13.5 → 14 (`--fs-lg`) — NavItem label, mobile search/inline create input, TextInput

### Tailwind / DaisyUI removal (resolved 2026-04-24)

Tailwind and DaisyUI fully removed: Tailwind preflight, DaisyUI plugin, theme block, `tailwind-merge`, `prettier-plugin-tailwindcss`, `@tailwindcss/vite`. All callsites converted to CSS modules + tokens. `cn()` helper deleted; callsites use `clsx` directly.

Replaced preflight with a minimal hand-rolled reset in `styles.css` (button reset, input/textarea font inherit, heading/list margin reset, link inherit, image/svg block + max-width, `box-sizing: border-box` on `*`).
