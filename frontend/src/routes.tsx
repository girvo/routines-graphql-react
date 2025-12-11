import { createBrowserRouter } from 'react-router'
import { Login } from './login/Login'
import { Register } from './login/Register'
import { AppError } from './AppError'
import { Routine } from './Routine'
import { AppShell } from './AppShell'

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
    ],
  },
])
