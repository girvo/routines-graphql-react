import type { EntryPoint } from '../relay/types.ts'
import type { TasksPageQuery } from './__generated__/TasksPageQuery.graphql.ts'
import TasksPageQueryNode from './__generated__/TasksPageQuery.graphql.ts'

export const TasksPageEntrypoint: EntryPoint<TasksPageQuery> = {
  root: () => import('./TasksPage.tsx'),
  query: TasksPageQueryNode,
  getVariables: () => ({}),
}
