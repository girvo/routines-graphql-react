import type { EntryPoint, EntryPointComponent } from 'react-relay'
import { JSResource } from '../relay/JSResource.ts'
import TasksPageQueryDocument, {
  type TasksPageQuery,
} from './__generated__/TasksPageQuery.graphql'

// The type for the props your component receives via entrypoint
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type TasksPageEntryPointParams = {}

// Define the queries shape for this entrypoint
type TasksPageQueries = {
  tasksPageQuery: TasksPageQuery
}

// The component type that will receive these queries
export type TasksPageEntryPointComponent = EntryPointComponent<
  TasksPageQueries,
  Record<string, never>,
  Record<string, never>,
  null
>

export const TasksPageEntryPoint: EntryPoint<
  TasksPageEntryPointComponent,
  TasksPageEntryPointParams
> = {
  getPreloadProps: () => ({
    queries: {
      tasksPageQuery: {
        parameters: TasksPageQueryDocument,
        variables: {},
      },
    },
  }),
  root: JSResource('TasksPage', () =>
    import('./TasksPage.tsx').then(m => m.default),
  ),
}
