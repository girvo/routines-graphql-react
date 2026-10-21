import {
  type SimpleEntryPoint,
  JSResource,
} from '@loop-payments/react-router-relay'
import type TasksPage from './TasksPage.tsx'
import TasksPageQueryDocument from './__generated__/TasksPageQuery.graphql'

export const TasksPageEntryPoint: SimpleEntryPoint<typeof TasksPage> = {
  root: JSResource('TasksPage', () => import('./TasksPage.tsx')),
  getPreloadProps() {
    return {
      queries: {
        tasksPageQuery: {
          parameters: TasksPageQueryDocument,
          variables: {},
        },
      },
    }
  },
}
