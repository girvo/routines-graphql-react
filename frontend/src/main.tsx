import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './utils/ErrorBoundary.tsx'
import { environment } from './relay/environment'
import { RelayEnvironmentProvider } from 'react-relay'
import { AuthProvider } from './login/AuthContext.tsx'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary>
        <Suspense fallback="Loading...">
          <AuthProvider>
            <App />
          </AuthProvider>
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  </StrictMode>,
)
