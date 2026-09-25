import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import type WeeklyPlanPage from './WeeklyPlanPage.tsx'
import { dayFromRouteParam, daySelectorToDayOfWeek } from './days.ts'
import WeeklyPlanPageQueryDoc from './__generated__/WeeklyPlanPageQuery.graphql.ts'

export const WeeklyPlanPageEntryPoint: SimpleEntryPoint<typeof WeeklyPlanPage> =
  {
    root: JSResource('WeeklyPlanPage', () => import('./WeeklyPlanPage.tsx')),
    getPreloadProps({ params }) {
      const day = dayFromRouteParam(params.day)
      return {
        queries: {
          weeklyPlanPageQuery: {
            parameters: WeeklyPlanPageQueryDoc,
            variables: { dayOfWeek: daySelectorToDayOfWeek(day) },
            options: { fetchPolicy: 'store-and-network' },
          },
        },
        extraProps: { day },
      }
    },
  }
