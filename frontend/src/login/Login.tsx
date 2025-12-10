import { useActionState, use } from 'react'
import { type } from 'arktype'
import { cn } from '../utils/tailwind'
import { capitalise } from '../utils/text'
import { AuthContext } from '../auth/auth-store'
import { authSchema, authResponse } from './auth-types'
import {
  container,
  card,
  formGroup,
  input,
  submitButton,
  linkButton,
} from './auth-styles'
import { NavLink } from 'react-router'

export const Login = () => {
  const { setAccessToken } = use(AuthContext)

  // Login handler
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const email = formData.get('email')
      const password = formData.get('password')

      const result = authSchema({
        email,
        password,
      })

      if (result instanceof type.errors) {
        const errors: Record<string, string> = {}
        result.forEach(error => {
          errors[error.path.toString()] = error.message
        })
        return {
          errors,
          email: String(email ?? ''),
          password: String(password ?? ''),
        }
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

        if (!httpResponse.ok) {
          const errorMessage = json.message || json.error || 'Request failed'
          return {
            success: false,
            errors: { network: errorMessage } as Record<string, string>,
          }
        }

        const validatedResponse = authResponse(json)

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
      success: false,
      errors: {},
    },
  )

  return (
    <div className={container}>
      <div className={card}>
        <h1 className="mb-8 text-center text-4xl font-bold">Login</h1>
        <form
          className="flex flex-col gap-4"
          action={formAction}
          method="POST"
          noValidate
        >
          <div className={formGroup}>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              defaultValue={state?.email}
              className={cn(
                input,
                state?.errors?.email && !isPending && 'input-error',
              )}
              disabled={isPending}
            />
            {state?.errors?.email && !isPending && (
              <span className="text-error mt-1 text-sm">
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
              defaultValue={state?.password}
              className={cn(
                input,
                state?.errors?.password && !isPending && 'input-error',
              )}
              disabled={isPending}
            />
            {state?.errors?.password && !isPending && (
              <span className="text-error mt-1 text-sm">
                {capitalise(state.errors.password)}
              </span>
            )}
          </div>
          <button type="submit" className={submitButton} disabled={isPending}>
            Login
          </button>
          {state?.errors?.network && (
            <div className="alert alert-error">
              {capitalise(state.errors.network)}
            </div>
          )}
        </form>
        <NavLink to="/register" className={linkButton}>
          Don't have an account? Register
        </NavLink>
      </div>
    </div>
  )
}
