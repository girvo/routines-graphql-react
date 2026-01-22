import type { EntryPointRouteObject } from '@loop-payments/react-router-relay'
import type { RouteObject } from 'react-router-dom'
import { Login } from './login/Login.tsx'
import { Register } from './login/Register.tsx'
import { RouteErrorBoundary } from './AppError.tsx'
import { Routine } from './Routine.tsx'
import { AppShell } from './AppShell.tsx'
import { TasksPageEntryPoint } from './Tasks/TasksPage.entrypoint.ts'
import { WeeklyPlanPageEntryPoint } from './WeeklyPlan/WeeklyPlanPage.entrypoint.ts'

export const unAuthedRouteConfig: RouteObject[] = [
  {
    path: '/',
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        index: true,
        Component: Login,
        handle: {
          title: 'Login',
        },
      },
      {
        path: 'register',
        Component: Register,
        handle: {
          title: 'Register',
        },
      },
    ],
  },
]

export const authedRouteConfig: EntryPointRouteObject[] = [
  {
    ErrorBoundary: RouteErrorBoundary,
    Component: AppShell,
    children: [
      {
        path: '/',
        Component: Routine,
        handle: {
          title: 'Routine',
        },
      },
      {
        path: '/tasks',
        entryPoint: TasksPageEntryPoint,
        handle: {
          title: 'All tasks',
          loading: () => 'Loading tasks page...',
        },
      },
      {
        path: '/weekly',
        entryPoint: WeeklyPlanPageEntryPoint,
        handle: {
          title: 'Weekly planner',
          loading: () => 'Loading weekly plan...',
        },
      },
    ],
  } as EntryPointRouteObject,
]
