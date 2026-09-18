// Both `schema.graphql` enums that cross the backend/frontend boundary live here,
// with their values in exactly the schema's order. `backend/codegen.ts` maps the
// generated resolver types onto these via `database/types.ts`, so adding a member
// to one of the schema enums must be paired with an edit here.

export const DAY_OF_WEEK_VALUES = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

export type DayOfWeek = (typeof DAY_OF_WEEK_VALUES)[number]

export const DAY_SECTION_VALUES = ['MORNING', 'MIDDAY', 'EVENING'] as const

export type DaySection = (typeof DAY_SECTION_VALUES)[number]

export const isDayOfWeek = (value: string): value is DayOfWeek =>
  DAY_OF_WEEK_VALUES.includes(value as DayOfWeek)

export const isDaySection = (value: string): value is DaySection =>
  DAY_SECTION_VALUES.includes(value as DaySection)
