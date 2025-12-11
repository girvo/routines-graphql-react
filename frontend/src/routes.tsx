import { createBrowserRouter } from 'react-router'
import { Login } from './login/Login.tsx'
import { Register } from './login/Register.tsx'
import { AppError } from './AppError.tsx'
import { Routine } from './Routine.tsx'
import { AppShell } from './AppShell.tsx'
import { TasksPageEntryPoint } from './Tasks/TasksPage.entrypoint.ts'
import { createEntryPointRoute } from './relay/createEntryPointRoute.tsx'

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
        ...createEntryPointRoute(
          TasksPageEntryPoint,
          {},
          {},
          <div>Loading...</div>,
        ),
        handle: {
          title: 'All tasks',
        },
      },
    ],
  },
])
