# DESIGN.md - Routines App: Weekly Routine Editor

## Design System Specifications

### 1. Color Palette

- **Primary Accent:** #4F46E5 (Indigo 600) - Used for active states, primary buttons, and highlights.
- **Backgrounds:**
  - Base: #FFFFFF (White)
  - Sidebar/Muted: #F8FAFC (Slate 50)
  - Hover: #F1F5F9 (Slate 100)
- **Typography:**
  - Primary Text: #1E293B (Slate 800)
  - Muted/Secondary: #64748B (Slate 500)
  - Borders/Dividers: #E2E8F0 (Slate 200)
- **Status/Actions:**
  - Success: #10B981 (Emerald 500)
  - Danger: #EF4444 (Red 500)

### 2. Typography Scale

- **Font Family:** Inter, system-ui, sans-serif
- **Base Size:** 14px (0.875rem)
- **Heading (Page):** 20px (1.25rem), SemiBold
- **Sub-headings (Sections):** 11px (0.6875rem), Bold, Uppercase, Tracking-wide
- **Body:** 14px, Regular
- **Small/Supportive:** 12px, Regular

### 3. Spacing & Layout

- **Grid:** 4px baseline.
- **Compact Padding:** 8px (p-2) to 12px (p-3) for list items.
- **Section Gaps:** 16px (gap-4) to 24px (gap-6).
- **Border Radius:** 6px (Rounded-md) for buttons and inputs; 4px for smaller elements.

### 4. Component Patterns

- **Task Slots:** Compact rows with icon, name, drag handle (hidden until hover on desktop), and kbab/overflow menu.
- **Navigation:**
  - Mobile: Bottom Tab Bar (64px height).
  - Desktop: Fixed Sidebar Rail (240px width).
- **Collapsible Sections:** Simple chevron-toggle headers with subtle dividers.
- **Buttons:**
  - Primary: Solid accent color.
  - Ghost: Muted text, background on hover.

## Information Architecture

- **App Sections:** Today, Weekly Routine, Tasks, Settings, Logout.
- **Weekly Editor Hierarchy:** Day Selection -> Time Section (Morning/Afternoon/Evening) -> Task Slots.
