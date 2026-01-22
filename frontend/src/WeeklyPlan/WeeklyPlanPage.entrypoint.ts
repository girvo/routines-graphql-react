import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import type WeeklyPlanPage from './WeeklyPlanPage.tsx'
import WeeklyPlanPageQueryDoc from './__generated__/WeeklyPlanPageQuery.graphql.ts'

export const WeeklyPlanPageEntryPoint: SimpleEntryPoint<typeof WeeklyPlanPage> =
  {
    root: JSResource('WeeklyPlanPage', () => import('./WeeklyPlanPage.tsx')),
    getPreloadProps() {
      return {
        queries: {
          weeklyPlanPageQuery: {
            parameters: WeeklyPlanPageQueryDoc,
            variables: {},
          },
        },
      }
    },
  }
