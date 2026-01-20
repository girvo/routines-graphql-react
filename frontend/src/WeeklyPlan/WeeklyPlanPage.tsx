import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import type { WeeklyPlanPageQuery } from './__generated__/WeeklyPlanPageQuery.graphql'

export interface WeeklyPlanPageProps {
  queries: {
    weeklyPlanPageQuery: PreloadedQuery<WeeklyPlanPageQuery>
  }
}

const WeeklyPlanPage = ({ queries }: WeeklyPlanPageProps) => {
  const data = usePreloadedQuery<WeeklyPlanPageQuery>(
    graphql`
      query WeeklyPlanPageQuery {
        weeklySchedule {
          monday {
            dayOfWeek
            morning(first: 100) {
              edges {
                node {
                  id
                  createdAt
                  section
                  task {
                    ...TaskDisplay
                  }
                }
              }
            }
          }
        }
      }
    `,
    queries.weeklyPlanPageQuery,
  )

  console.log(data)

  return <div>Hello, world!</div>
}

export default WeeklyPlanPage
