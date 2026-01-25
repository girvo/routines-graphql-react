export const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type Day = (typeof DAYS)[number]

export type DayOfWeek = Uppercase<Day>

export const daySelectorToDayOfWeek = (selector: Day): DayOfWeek => {
  switch (selector) {
    case 'monday':
      return 'MONDAY'
    case 'tuesday':
      return 'TUESDAY'
    case 'wednesday':
      return 'WEDNESDAY'
    case 'thursday':
      return 'THURSDAY'
    case 'friday':
      return 'FRIDAY'
    case 'saturday':
      return 'SATURDAY'
    case 'sunday':
      return 'SUNDAY'
  }
}

export type DaySection = 'MORNING' | 'MIDDAY' | 'EVENING'

export interface DaySelection {
  dayOfWeek: DayOfWeek
  daySection: DaySection
}
