import { describe, expect, it } from 'vitest'
import { sectionCounts, sectionLabel } from './section-counts.ts'

describe('sectionCounts', () => {
  it('counts each section and returns them in schema order', () => {
    expect(sectionCounts(['EVENING', 'MORNING', 'MORNING', 'MIDDAY'])).toEqual([
      { section: 'MORNING', count: 2 },
      { section: 'MIDDAY', count: 1 },
      { section: 'EVENING', count: 1 },
    ])
  })

  it('leaves out sections the task has no slot in', () => {
    expect(sectionCounts(['EVENING', 'EVENING'])).toEqual([
      { section: 'EVENING', count: 2 },
    ])
  })

  it('returns nothing for an unassigned task or unknown sections', () => {
    expect(sectionCounts([])).toEqual([])
    expect(sectionCounts(['NIGHT', 'morning', ''])).toEqual([])
  })

  it('labels every section for its chip', () => {
    expect(sectionLabel('MORNING')).toBe('Morning')
    expect(sectionLabel('MIDDAY')).toBe('Midday')
    expect(sectionLabel('EVENING')).toBe('Evening')
  })
})
