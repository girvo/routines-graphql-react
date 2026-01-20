import type { EntryPoint, EntryPointComponent } from 'react-relay'
import { JSResource } from '../relay/JSResource.ts'
// import TasksPageQueryDocument, {
//   type TasksPageQuery,
// } from './__generated__/TasksPageQuery.graphql'
import WeeklyPlanPageQueryDoc, {
  type WeeklyPlanPageQuery,
} from './__generated__/WeeklyPlanPageQuery.graphql.ts'

// The type for the props your component receives via entrypoint
// This component _has_ none, and ESLint doesn't like `{}` lol
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type WeeklyPlanPageEntryPointParams = {}

type WeeklyPlanPageQueries = {
  weeklyPlanPageQuery: WeeklyPlanPageQuery
}

// The component type that will receive these queries
// NOTE: we should probably be importing this from TasksPage directly
// This stuff is why we have wrappers that do createEntryPoint and so on!
export type WeeklyPlanPageEntrypointComponent = EntryPointComponent<
  WeeklyPlanPageQueries,
  Record<string, never>,
  Record<string, never>,
  null
>

export const WeeklyPlanPageEntryPoint: EntryPoint<
  WeeklyPlanPageEntrypointComponent,
  WeeklyPlanPageEntryPointParams
> = {
  getPreloadProps: () => ({
    queries: {
      weeklyPlanPageQuery: {
        parameters: WeeklyPlanPageQueryDoc,
        variables: {},
      },
    },
  }),
  root: JSResource('WeeklyPlanPage', () =>
    import('./WeeklyPlanPage.tsx').then(m => m.default),
  ),
}
