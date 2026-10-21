import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import type SettingsPage from './SettingsPage.tsx'
import SettingsPageQueryDocument from './__generated__/SettingsPageQuery.graphql.ts'

export const SettingsPageEntryPoint: SimpleEntryPoint<typeof SettingsPage> = {
  root: JSResource('SettingsPage', () => import('./SettingsPage.tsx')),
  getPreloadProps() {
    return {
      queries: {
        settingsPageQuery: {
          parameters: SettingsPageQueryDocument,
          variables: {},
        },
      },
    }
  },
}
