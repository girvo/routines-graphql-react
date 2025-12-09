import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './utils/ErrorBoundary.tsx'
import { environment } from './relay/environment'
import { RelayEnvironmentProvider } from 'react-relay'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary>
        <Suspense fallback="Loading...">
          <App />
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  </StrictMode>,
)
