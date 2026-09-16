import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { environment } from './relay/environment'
import { RelayEnvironmentProvider } from 'react-relay'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { ToastProvider } from './toast/ToastProvider.tsx'
import { AppError } from './AppError.tsx'
import { registerServiceWorker } from './push/push-client.ts'
import './styles.css'

// A registration must exist before `PushManager.subscribe` can be called, and
// iOS only offers notification permission once this file is being served.
if ('serviceWorker' in navigator) {
  void registerServiceWorker()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <ErrorBoundary fallbackRender={AppError}>
        <Suspense fallback="Loading...">
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  </StrictMode>,
)
