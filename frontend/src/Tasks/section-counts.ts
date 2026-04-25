export type DaySection = 'MORNING' | 'MIDDAY' | 'EVENING'

export type SectionCount = { section: DaySection; count: number }

const ORDER: DaySection[] = ['MORNING', 'MIDDAY', 'EVENING']

const LABEL: Record<DaySection, string> = {
  MORNING: 'Morning',
  MIDDAY: 'Midday',
  EVENING: 'Evening',
}

const isKnownSection = (value: string): value is DaySection =>
  value === 'MORNING' || value === 'MIDDAY' || value === 'EVENING'

export const sectionLabel = (section: DaySection) => LABEL[section]

export const sectionCounts = (sections: ReadonlyArray<string>): SectionCount[] => {
  const counts: Record<DaySection, number> = { MORNING: 0, MIDDAY: 0, EVENING: 0 }
  for (const s of sections) {
    if (isKnownSection(s)) counts[s] += 1
  }
  return ORDER.filter(s => counts[s] > 0).map(section => ({ section, count: counts[section] }))
}
