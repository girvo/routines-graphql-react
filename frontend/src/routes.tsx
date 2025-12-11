import { createBrowserRouter, useLoaderData } from 'react-router'
import type { PreloadedEntryPoint } from 'react-relay'
import { EntryPointContainer } from 'react-relay'
import { Login } from './login/Login.tsx'
import { Register } from './login/Register.tsx'
import { AppError } from './AppError.tsx'
import { Routine } from './Routine.tsx'
import { AppShell } from './AppShell.tsx'
import {
  TasksPageEntryPoint,
  type TasksPageEntryPointComponent,
} from './Tasks/TasksPage.entrypoint.ts'
import { loadEntryPoint } from './relay/loadEntrypoint.ts'

export const unAuthedRoutes = createBrowserRouter([
  {
    path: '/',
    ErrorBoundary: AppError,
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
])

export const routes = createBrowserRouter([
  {
    ErrorBoundary: AppError,
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
        loader: () => loadEntryPoint(TasksPageEntryPoint, {}),
        Component: function TasksPageRoute() {
          const entryPointReference =
            useLoaderData() as PreloadedEntryPoint<TasksPageEntryPointComponent>
          return (
            <EntryPointContainer
              entryPointReference={entryPointReference}
              props={{}}
            />
          )
        },
        handle: {
          title: 'All tasks',
        },
      },
    ],
  },
])
