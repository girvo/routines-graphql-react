import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import type AppShell from './AppShell.tsx'
import AppShellQueryNode from './__generated__/AppShellQuery.graphql.ts'

export const AppShellEntryPoint: SimpleEntryPoint<typeof AppShell> = {
  root: JSResource('AppShell', () => import('./AppShell.tsx')),
  getPreloadProps() {
    return {
      queries: {
        appShellQuery: {
          parameters: AppShellQueryNode,
          variables: {},
          options: { fetchPolicy: 'store-and-network' },
        },
      },
    }
  },
}
