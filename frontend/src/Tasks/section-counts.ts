import {
  DAY_SECTION_VALUES,
  isDaySection,
  type DaySection,
} from '@my-routines/shared'

export type { DaySection }

export type SectionCount = { section: DaySection; count: number }

const LABEL: Record<DaySection, string> = {
  MORNING: 'Morning',
  MIDDAY: 'Midday',
  EVENING: 'Evening',
}

export const sectionLabel = (section: DaySection) => LABEL[section]

export const sectionCounts = (
  sections: ReadonlyArray<string>,
): SectionCount[] => {
  const counts: Record<DaySection, number> = {
    MORNING: 0,
    MIDDAY: 0,
    EVENING: 0,
  }
  for (const s of sections) {
    if (isDaySection(s)) counts[s] += 1
  }
  return DAY_SECTION_VALUES.filter(s => counts[s] > 0).map(section => ({
    section,
    count: counts[section],
  }))
}
