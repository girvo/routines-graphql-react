import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { environment } from './relay/environment'
import { RelayEnvironmentProvider } from 'react-relay'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { AppError } from './AppError.tsx'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary fallbackRender={AppError}>
        <Suspense fallback="Loading...">
          <AuthProvider>
            <App />
          </AuthProvider>
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  </StrictMode>,
)
