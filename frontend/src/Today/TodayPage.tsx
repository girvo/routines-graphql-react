import { graphql, usePreloadedQuery } from 'react-relay'
import { format, isToday } from 'date-fns'
import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import type { TodayPageQuery } from './__generated__/TodayPageQuery.graphql'
import { usePageHeader } from '../utils/page-header'

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
          morning {
            edges {
              node {
                __typename
              }
            }
          }
        }
      }
    `,
    queries.todayPageQuery,
  )

  console.log(data)

  const displayDate = date ?? new Date()
  const isCurrentDay = date === null || isToday(date)
  usePageHeader({
    title: isCurrentDay ? 'Today' : format(displayDate, 'EEEE'),
    subtitle: isCurrentDay
      ? format(displayDate, 'EEEE, MMMM d')
      : format(displayDate, 'MMMM d'),
  })

  return <div>Hello, world!</div>
}

export default TodayPage
