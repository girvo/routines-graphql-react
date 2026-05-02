import { useCallback, useMemo } from 'react'
import { graphql, usePreloadedQuery } from 'react-relay'
import { format, isToday } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import type { TodayPageQuery } from './__generated__/TodayPageQuery.graphql'
import { usePageHeader } from '../utils/page-header'
import { DatePicker } from '../primitives/form/DatePicker.tsx'
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

  const navigate = useNavigate()
  const displayDate = useMemo(() => date ?? new Date(), [date])

  const handleDateChange = useCallback(
    (next: Date) => {
      const search = isToday(next) ? '' : `?date=${format(next, 'yyyy-MM-dd')}`
      navigate({ search })
    },
    [navigate],
  )

  const actions = useMemo(
    () => <DatePicker value={displayDate} onChange={handleDateChange} />,
    [displayDate, handleDateChange],
  )

  usePageHeader({
    title: format(displayDate, 'EEEE'),
    subtitle: null,
    actions,
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
