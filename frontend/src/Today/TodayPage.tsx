import { graphql, usePreloadedQuery } from 'react-relay'
import { format, isToday } from 'date-fns'
import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import type { TodayPageQuery } from './__generated__/TodayPageQuery.graphql'
import { usePageHeader } from '../utils/page-header'
import { TodaySection } from './TodaySection.tsx'
import styles from './TodayPage.module.css'

type TodayPageProps = SimpleEntryPointProps<
  { todayPageQuery: TodayPageQuery },
  { date: Date | null }
>

const TodayPage = ({ queries, extraProps: { date } }: TodayPageProps) => {
  const data = usePreloadedQuery(
    graphql`
      query TodayPageQuery($date: DateTime) {
        dailyRoutine(date: $date) {
          date
          dayOfWeek
          morning(first: 100) {
            ...TodaySection_section
          }
          midday(first: 100) {
            ...TodaySection_section
          }
          evening(first: 100) {
            ...TodaySection_section
          }
        }
      }
    `,
    queries.todayPageQuery,
  )

  const displayDate = date ?? new Date()
  const isCurrentDay = date === null || isToday(date)
  usePageHeader({
    title: isCurrentDay ? 'Today' : format(displayDate, 'EEEE'),
    subtitle: isCurrentDay
      ? format(displayDate, 'EEEE, MMMM d')
      : format(displayDate, 'MMMM d'),
  })

  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <TodaySection label="Morning" section={data.dailyRoutine.morning} />
        <TodaySection label="Midday" section={data.dailyRoutine.midday} />
        <TodaySection label="Evening" section={data.dailyRoutine.evening} />
      </div>
    </div>
  )
}

export default TodayPage
