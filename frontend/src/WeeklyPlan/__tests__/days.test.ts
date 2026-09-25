import { describe, expect, it } from 'vitest'
import { DAY_OF_WEEK_VALUES } from '@my-routines/shared'
import {
  DAYS,
  dayFromRouteParam,
  daySelectorToDayOfWeek,
  type Day,
} from '../days.ts'

describe('week day selectors', () => {
  it('lists all seven days with monday first', () => {
    expect(DAYS).toEqual([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ])
  })

  it('maps the selector list onto the schema enum in order', () => {
    expect(DAYS.map(day => daySelectorToDayOfWeek(day))).toEqual([
      ...DAY_OF_WEEK_VALUES,
    ])
  })

  it('round-trips every enum value through its selector form', () => {
    for (const dayOfWeek of DAY_OF_WEEK_VALUES) {
      const selector = dayOfWeek.toLowerCase() as Day
      expect(daySelectorToDayOfWeek(selector)).toBe(dayOfWeek)
    }
  })

  it('reads a valid day from the route param', () => {
    expect(dayFromRouteParam('thursday')).toBe('thursday')
  })

  it('falls back to monday for a missing or unknown route param', () => {
    expect(dayFromRouteParam(undefined)).toBe('monday')
    expect(dayFromRouteParam('THURSDAY')).toBe('monday')
    expect(dayFromRouteParam('someday')).toBe('monday')
  })
})
