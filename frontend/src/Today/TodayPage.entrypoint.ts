import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import { isValid, parseISO } from 'date-fns'
import type TodayPage from './TodayPage.tsx'
import TodayPageQueryDocument from './__generated__/TodayPageQuery.graphql.ts'

export const TodayPageEntryPoint: SimpleEntryPoint<typeof TodayPage> = {
  root: JSResource('TodayPage', () => import('./TodayPage.tsx')),
  getPreloadProps({ request }) {
    const dateParam = new URL(request.url).searchParams.get('date')
    const parsed = dateParam ? parseISO(dateParam) : null
    const date = parsed && isValid(parsed) ? parsed : null
    return {
      queries: {
        todayPageQuery: {
          parameters: TodayPageQueryDocument,
          variables: { date: date?.toISOString() ?? null },
        },
      },
      extraProps: { date },
    }
  },
}
