import { graphql, usePreloadedQuery } from 'react-relay'
import type { SimpleEntryPointProps } from '@loop-payments/react-router-relay'
import type { TodayPageQuery } from './__generated__/TodayPageQuery.graphql'

type TodayPageProps = SimpleEntryPointProps<{ todayPageQuery: TodayPageQuery }>

const TodayPage = ({ queries }: TodayPageProps) => {
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

  return <div>Hello, world!</div>
}

export default TodayPage
