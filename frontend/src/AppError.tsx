import { useRouteError } from 'react-router-dom'

export const AppError = ({ error }: { error?: Error }) => (
  <div className="bg-base-200 flex min-h-screen items-center justify-center p-4">
    <div
      className={`card bg-base-100 w-full shadow-xl ${error && import.meta.env.DEV ? 'max-w-3xl' : 'max-w-lg'}`}
    >
      <div className="card-body items-center text-center">
        <svg
          className="text-error mb-4 h-20 w-20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732
  4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h2 className="text-error mb-3 text-2xl font-bold">
          Something Went Wrong
        </h2>

        <p className="text-base-content/70">
          An unexpected error occurred. Please try refreshing the page.
        </p>

        {error && import.meta.env.DEV && (
          <div className="bg-base-200 mt-4 w-full rounded p-3 text-left">
            <p className="text-error mb-2 text-sm font-semibold">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className="text-base-content/60 max-h-64 overflow-auto font-mono text-xs break-all whitespace-pre-wrap">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)

export const RouteErrorBoundary = () => {
  const routeError = useRouteError()
  const error =
    routeError instanceof Error ? routeError : new Error(String(routeError))
  return <AppError error={error} />
}
