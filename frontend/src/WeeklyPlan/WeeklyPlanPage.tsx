import { useState } from 'react'
import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import { graphql, usePreloadedQuery } from 'react-relay'
import type { WeeklyPlanPageQuery } from './__generated__/WeeklyPlanPageQuery.graphql'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { capitalise } from '../utils/text.ts'
import { Button } from '../primitives/Button.tsx'
import { WeeklyPlanDay } from './WeeklyPlanDay.tsx'
import { WeekDaySelector } from './WeekDaySelector.tsx'
import { daySelectorToDayOfWeek, DAYS, type Day } from './days.ts'
import styles from './WeeklyPlanPage.module.css'

type Props = SimpleEntryPointProps<{ weeklyPlanPageQuery: WeeklyPlanPageQuery }>

const WeeklyPlanPage = ({ queries }: Props) => {
  const [selectedDay, setSelectedDay] = useState<Day>('monday')

  const schedule = usePreloadedQuery<WeeklyPlanPageQuery>(
    graphql`
      query WeeklyPlanPageQuery {
        mondayMorning: daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
          ...DaySection_section
        }
        mondayMidday: daySectionSlots(dayOfWeek: MONDAY, section: MIDDAY) {
          ...DaySection_section
        }
        mondayEvening: daySectionSlots(dayOfWeek: MONDAY, section: EVENING) {
          ...DaySection_section
        }
        tuesdayMorning: daySectionSlots(dayOfWeek: TUESDAY, section: MORNING) {
          ...DaySection_section
        }
        tuesdayMidday: daySectionSlots(dayOfWeek: TUESDAY, section: MIDDAY) {
          ...DaySection_section
        }
        tuesdayEvening: daySectionSlots(dayOfWeek: TUESDAY, section: EVENING) {
          ...DaySection_section
        }
        wednesdayMorning: daySectionSlots(
          dayOfWeek: WEDNESDAY
          section: MORNING
        ) {
          ...DaySection_section
        }
        wednesdayMidday: daySectionSlots(
          dayOfWeek: WEDNESDAY
          section: MIDDAY
        ) {
          ...DaySection_section
        }
        wednesdayEvening: daySectionSlots(
          dayOfWeek: WEDNESDAY
          section: EVENING
        ) {
          ...DaySection_section
        }
        thursdayMorning: daySectionSlots(
          dayOfWeek: THURSDAY
          section: MORNING
        ) {
          ...DaySection_section
        }
        thursdayMidday: daySectionSlots(dayOfWeek: THURSDAY, section: MIDDAY) {
          ...DaySection_section
        }
        thursdayEvening: daySectionSlots(
          dayOfWeek: THURSDAY
          section: EVENING
        ) {
          ...DaySection_section
        }
        fridayMorning: daySectionSlots(dayOfWeek: FRIDAY, section: MORNING) {
          ...DaySection_section
        }
        fridayMidday: daySectionSlots(dayOfWeek: FRIDAY, section: MIDDAY) {
          ...DaySection_section
        }
        fridayEvening: daySectionSlots(dayOfWeek: FRIDAY, section: EVENING) {
          ...DaySection_section
        }
        saturdayMorning: daySectionSlots(
          dayOfWeek: SATURDAY
          section: MORNING
        ) {
          ...DaySection_section
        }
        saturdayMidday: daySectionSlots(dayOfWeek: SATURDAY, section: MIDDAY) {
          ...DaySection_section
        }
        saturdayEvening: daySectionSlots(
          dayOfWeek: SATURDAY
          section: EVENING
        ) {
          ...DaySection_section
        }
        sundayMorning: daySectionSlots(dayOfWeek: SUNDAY, section: MORNING) {
          ...DaySection_section
        }
        sundayMidday: daySectionSlots(dayOfWeek: SUNDAY, section: MIDDAY) {
          ...DaySection_section
        }
        sundayEvening: daySectionSlots(dayOfWeek: SUNDAY, section: EVENING) {
          ...DaySection_section
        }
      }
    `,
    queries.weeklyPlanPageQuery,
  )

  const currentIndex = DAYS.indexOf(selectedDay)
  const goToPreviousDay = () =>
    setSelectedDay(DAYS[(currentIndex - 1 + DAYS.length) % DAYS.length])
  const goToNextDay = () =>
    setSelectedDay(DAYS[(currentIndex + 1) % DAYS.length])

  return (
    <div className={styles.page}>
      <div className={styles.mobileHeader}>
        <Button
          variant="ghost"
          size="sm"
          iconOnly={ChevronLeft}
          aria-label="Previous day"
          onClick={goToPreviousDay}
        />
        <span className={styles.mobileTitle}>{capitalise(selectedDay)}</span>
        <Button
          variant="ghost"
          size="sm"
          iconOnly={ChevronRight}
          aria-label="Next day"
          onClick={goToNextDay}
        />
      </div>
      <div className={styles.body}>
        <aside className={styles.selector}>
          <WeekDaySelector selected={selectedDay} onSelect={setSelectedDay} />
        </aside>
        <WeeklyPlanDay
          dayOfWeek={daySelectorToDayOfWeek(selectedDay)}
          morning={schedule[`${selectedDay}Morning`]}
          midday={schedule[`${selectedDay}Midday`]}
          evening={schedule[`${selectedDay}Evening`]}
        />
      </div>
    </div>
  )
}

export default WeeklyPlanPage
