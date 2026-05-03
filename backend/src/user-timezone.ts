import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import type { DayOfWeek } from './graphql/resolver-types.ts'

export const USER_TIMEZONE = 'Australia/Brisbane'

const DAY_NAMES: readonly DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

export const getUserDayKey = (instant: Date): string =>
  formatInTimeZone(instant, USER_TIMEZONE, 'yyyy-MM-dd')

export const getUserDayOfWeek = (instant: Date): DayOfWeek => {
  const upper = formatInTimeZone(instant, USER_TIMEZONE, 'EEEE').toUpperCase()
  if (!DAY_NAMES.includes(upper as DayOfWeek)) {
    throw new Error(`Unexpected day name from formatInTimeZone: ${upper}`)
  }
  return upper as DayOfWeek
}

export const getUserDayBoundsUtc = (
  instant: Date,
): { start: Date; end: Date } => {
  const dayKey = getUserDayKey(instant)
  return {
    start: fromZonedTime(`${dayKey}T00:00:00.000`, USER_TIMEZONE),
    end: fromZonedTime(`${dayKey}T23:59:59.999`, USER_TIMEZONE),
  }
}
