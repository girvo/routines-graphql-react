import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import type AppShell from './AppShell.tsx'
import DesktopSidebarQueryNode from './shell/__generated__/DesktopSidebarQuery.graphql.ts'

export const AppShellEntryPoint: SimpleEntryPoint<typeof AppShell> = {
  root: JSResource('AppShell', () => import('./AppShell.tsx')),
  getPreloadProps() {
    return {
      queries: {
        userQuery: {
          parameters: DesktopSidebarQueryNode,
          variables: {},
        },
      },
    }
  },
}
