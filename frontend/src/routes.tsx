import { createBrowserRouter } from 'react-router'
import { Login } from './login/Login'
import { Register } from './login/Register'
import { AppError } from './AppError'
import { Routine } from './Routine'

export const unAuthedRoutes = createBrowserRouter([
  {
    path: '/',
    ErrorBoundary: AppError,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
    ],
  },
])

export const routes = createBrowserRouter([
  {
    path: '/',
    ErrorBoundary: AppError,
    children: [
      {
        index: true,
        Component: Routine,
      },
    ],
  },
])
