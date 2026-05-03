import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import { format } from 'date-fns'
import type TodayPage from './TodayPage.tsx'
import TodayPageQueryDocument from './__generated__/TodayPageQuery.graphql.ts'

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const TodayPageEntryPoint: SimpleEntryPoint<typeof TodayPage> = {
  root: JSResource('TodayPage', () => import('./TodayPage.tsx')),
  getPreloadProps({ request }) {
    const dateParam = new URL(request.url).searchParams.get('date')
    const explicitDayKey =
      dateParam && DATE_ONLY_PATTERN.test(dateParam) ? dateParam : null
    const dayKey = explicitDayKey ?? format(new Date(), 'yyyy-MM-dd')
    const date = new Date(`${dayKey}T12:00:00.000Z`)
    return {
      queries: {
        todayPageQuery: {
          parameters: TodayPageQueryDocument,
          variables: { date: date.toISOString() },
        },
      },
      extraProps: { date: explicitDayKey ? date : null },
    }
  },
}
