# Design System — Open Questions

Running list of decisions deferred while building out primitives from the Penpot design. Revisit in a dedicated session before the system hardens.

## Icon size scale

Currently only `--icon-sm: 16px` and `--icon-md: 20px` exist.

Known icon sizes actually used:
- `--icon-sm` (16) — Button icons
- `--icon-md` (20) — IconChip icons, TextInput leading/trailing icons
- `14` (hardcoded) — CheckBox `md` checkmark
- `12` (hardcoded) — CheckBox `sm` checkmark

CheckBox's 12 and 14 are smaller than anything in the scale and don't fit a clean sm/md/lg progression. Options to explore:
- Introduce `--icon-xs: 12`, `--icon-sm: 14`, bump existing `--icon-sm` → `--icon-md` → `--icon-lg` (renames across codebase).
- Keep CheckBox values as checkbox-specific tokens (e.g. `--checkbox-check-md`) since the checkmark is an icon *inside* a fixed-size control and may not belong on the general icon scale.

Needs a proper audit of every icon site before committing.

## Space scale

Only `--space-1..6` (4, 8, 12, 16, 20, 24). No guidance yet on when to use which. No smaller (2px) or larger (32, 40, 48) values. Lots of raw px still appearing (control heights, icon sizes, per-component paddings).

Deferred: should we extend the scale, or adopt a strict 4pt-grid rule with a named scale covering more stops?

## Control heights

Three different heights for "form controls" so far:
- `--control-h: 28px` — Button
- `32px` (`--input-h-sm` — TODO, currently hardcoded in TextInput) — TextInput `sm`
- `36px` (`--input-h-md` — TODO, currently hardcoded in TextInput) — TextInput `md`

Questions:
- Should input sizes get their own `--input-h-sm` / `--input-h-md` tokens? (Leaning yes; added inline in TextInput for now, not yet in `tokens.css`.)
- Should Button's 28px become one of a unified control scale, or stay as its own thing?
- Is there a case for a 40px control later (large primary CTAs, mobile touch targets)?

## Surface greys

Consolidated `--surface-hover-bg` (#f3f3f3) and `--surface-search-bg` (#f4f4f4) into `--surface-soft` (#f5f5f5). But we still have:
- `--surface-avatar-bg: #e8e8e8`
- `--surface-table-head: #fafafa`
- `--surface-bg: #fafafa`
- `--surface-bg-soft: #fcfcfc`
- `--surface-inline-create: #fcfcff`

Some of these are likely duplicates or near-duplicates waiting to be found. Worth a pass once more primitives land.

## Stroke greys

Currently:
- `--stroke-line: #ececec`
- `--stroke-line-medium: #dedede` (added for CheckBox)
- `--stroke-line-strong: #d4d4d4`
- `--stroke-hairline: #f1f1f1`

`--stroke-line-medium` and `--stroke-line-strong` aren't in the Colors story palette yet.

## Nav item radius

NavItem is designed with a 7px corner radius — off-scale. Current radius scale: `--radius-sm: 4`, `--radius-md: 6`, `--radius-lg: 12`, and `--control-radius: 8`. Using `--control-radius` (8px) since NavItem is an interactive control. 1px divergence from design. Revisit if we add a 7px stop or tighten the control radius scale.

## Border widths

- `--border-width: 1px` — standard
- `--border-width-md: 1.5px` — CheckBox (added). Not reused yet; if it stays a one-off, revert to inline.

## Font size half-pixels

Penpot exports show half-pixel sizes. Treating these as Penpot artefacts and rounding UP to the nearest value on our scale:
- 10.5 → 11 (`--fs-xs`) — SlotChip count
- 11.5 → 12 (`--fs-sm`) — SlotChip section label
- 12.5 → 13 (`--fs-md`) — DayChip label
- 13.5 → 14 (`--fs-lg`) — NavItem label, mobile search/inline create input

Confirm from the source design tokens export if Penpot exposes a cleaner scale.

## Typography

Refactored `typography.css` on 2026-04-21 to a composition-based system. Semantic-but-identical classes were removed per directive: *semantic meaning in CSS class names isn't useful — that's what component prop names are for.* Primitives compose role + size + (optional) weight/letter-spacing utility classes via `cn()` or CSS Modules `composes`.

Roles kept (each declares font-weight, letter-spacing, and a default font-size):
- `typo-title`, `typo-body`, `typo-label`, `typo-label-tight`, `typo-button`, `typo-tab`, `typo-brand`, `typo-mono`

Removed (collapsed into role + size composition): `typo-heading` (= title at xl), `typo-meta` (= body at smaller sizes), `typo-chip`, `typo-status`, `typo-body-strong-sm`, `typo-meta-strong-sm`, plus the original 9 unused classes.

Utility classes for composition: `typo-{xs..3xl}` (size), `typo-{regular,medium,semibold,bold}` (weight), `typo-ls-{tight-sm,tight-md,wide-xs,wide-sm,wide-md,wide-lg}` (letter-spacing). Sizes are declared *after* roles so they win at equal specificity. Compound selectors like `.typo-title.typo-xl` handle role+size couplings (e.g. tighter tracking at larger title sizes).

Remaining open question:
- **Token naming**: `--fs-xs..3xl` follows t-shirt sizing. If the scale grows we might want numeric (`--fs-11..20`) or role-based (`--fs-body`, `--fs-title`) instead. Deferred — revisit once more primitives land.

## Primitive API consistency

- `CheckBox` uses `onChange: (checked: boolean) => void` (value-based, since native checkbox change event is awkward and RHF `register` isn't typically used for checkboxes here).
- `TextInput` uses native `onChange: ChangeEventHandler<HTMLInputElement>` (so `{...register('title')}` from react-hook-form just works).

Inconsistent but intentional. Document this convention so future primitives choose deliberately: **value-based for controls where the native event is clumsy; native-event for inputs that'll pair with form libraries.**
