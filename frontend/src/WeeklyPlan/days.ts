import {
  DAY_OF_WEEK_VALUES,
  type DayOfWeek,
  type DaySection,
} from '@my-routines/shared'

export type { DayOfWeek, DaySection }

// The lowercase form the week picker uses for its buttons and route state.
export type Day = Lowercase<DayOfWeek>

// `toLowerCase` over the seven known values is total; TypeScript only sees `string`.
export const DAYS = DAY_OF_WEEK_VALUES.map(day => day.toLowerCase()) as Day[]

export const daySelectorToDayOfWeek = (selector: Day): DayOfWeek =>
  selector.toUpperCase() as DayOfWeek

export interface DaySelection {
  dayOfWeek: DayOfWeek
  daySection: DaySection
}
