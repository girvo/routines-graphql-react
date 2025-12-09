export const AppError = ({ error }: { error?: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <svg
            className="w-20 h-20 text-error mb-4"
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

          <h2 className="text-2xl font-bold text-error mb-3">
            Something Went Wrong
          </h2>

          <p className="text-base-content/70">
            An unexpected error occurred. Please try refreshing the page.
          </p>

          {error && (
            <div className="mt-4 p-3 bg-base-200 rounded w-full">
              <p className="text-xs font-mono text-left break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
