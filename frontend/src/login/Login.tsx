import { useActionState, use } from 'react'
import { type } from 'arktype'
import { cn } from '../utils/tailwind'
import { capitalise } from '../utils/text'
import { AuthContext } from './AuthContext'

// Styles
const container = cn('flex p-4 items-center justify-center md:min-h-screen')
const card = cn(
  'card bg-base-100 shadow-xl border border-base-300',
  'w-full md:w-96',
  'p-8',
)
const formGroup = cn('form-control w-full')
const input = cn('input input-bordered w-full')
const submitButton = cn('btn btn-primary w-full mt-4')

const loginSchema = type({
  email: 'string.email',
  password: 'string',
})

const loginSuccessResponse = type({
  success: 'true',
  accessToken: 'string',
})

const loginErrorResponse = type({
  success: 'false',
  errors: type({ message: 'string' }).array(),
})

const loginResponse = loginSuccessResponse.or(loginErrorResponse)

export const Login = () => {
  const { setAccessToken } = use(AuthContext)

  // Login handler
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = loginSchema({
        email: formData.get('email'),
        password: formData.get('password'),
      })

      if (result instanceof type.errors) {
        const errors: Record<string, string> = {}
        result.forEach(error => {
          errors[error.path.toString()] = error.message
        })
        return { errors }
      }

      try {
        const { email, password } = result
        const httpResponse = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
        })

        const json = await httpResponse.json()
        const validatedResponse = loginResponse(json)

        if (validatedResponse instanceof type.errors) {
          console.error(
            'Invalid response from server:',
            validatedResponse.summary,
          )
          return {
            success: false,
            errors: { network: 'Invalid server response' },
          }
        }

        if (validatedResponse.success) {
          setAccessToken(validatedResponse.accessToken)
          return { success: true }
        }

        return {
          success: false,
          errors: { network: validatedResponse.errors[0].message } as Record<
            string,
            string
          >,
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err)
          return {
            success: false,
            errors: { network: err.message } as Record<string, string>,
          }
        }

        return { success: false }
      }
    },
    {
      errors: {},
    },
  )

  return (
    <div className={container}>
      <div className={card}>
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
        <form className="flex flex-col gap-4" action={formAction} noValidate>
          <div className={formGroup}>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className={cn(
                input,
                state?.errors?.email && !isPending && 'input-error',
              )}
              disabled={isPending}
            />
            {state?.errors?.email && !isPending && (
              <span className="text-error text-sm mt-1">
                {capitalise(state.errors.email)}
              </span>
            )}
          </div>
          <div className={formGroup}>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className={cn(
                input,
                state?.errors?.password && !isPending && 'input-error',
              )}
              disabled={isPending}
            />
            {state?.errors?.password && !isPending && (
              <span className="text-error text-sm mt-1">
                {capitalise(state.errors.password)}
              </span>
            )}
          </div>
          <button type="submit" className={submitButton} disabled={isPending}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
