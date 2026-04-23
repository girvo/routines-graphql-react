import { use } from 'react'
import { useForm } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { cn } from '../utils/tailwind'
import { capitalise } from '../utils/text'
import { AuthContext } from '../auth/auth-store'
import { authSchema, authResponse, type AuthFormData } from './auth-types'
import styles from './AuthForm.module.css'
import { NavLink } from 'react-router-dom'

export const Login = () => {
  const { setAccessToken } = use(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AuthFormData>({
    resolver: arktypeResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: AuthFormData) => {
    try {
      const httpResponse = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      })

      const json = await httpResponse.json()

      if (!httpResponse.ok) {
        const errorMessage = json.message || json.error || 'Request failed'
        setError('root', { message: errorMessage })
        return
      }

      const validatedResponse = authResponse(json)

      if (validatedResponse instanceof type.errors) {
        console.error(
          'Invalid response from server:',
          validatedResponse.summary,
        )
        setError('root', { message: 'Invalid server response' })
        return
      }

      if (validatedResponse.success) {
        setAccessToken(validatedResponse.accessToken)
        return
      }

      setError('root', { message: validatedResponse.errors[0].message })
    } catch (err) {
      if (err instanceof Error) {
        console.error(err)
        setError('root', { message: err.message })
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register('email')}
              className={cn(
                styles.input,
                errors.email && !isSubmitting && styles.inputError,
              )}
              disabled={isSubmitting}
            />
            {errors.email?.message && !isSubmitting && (
              <span className={styles.fieldError}>
                {capitalise(errors.email.message)}
              </span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register('password')}
              className={cn(
                styles.input,
                errors.password && !isSubmitting && styles.inputError,
              )}
              disabled={isSubmitting}
            />
            {errors.password?.message && !isSubmitting && (
              <span className={styles.fieldError}>
                {capitalise(errors.password.message)}
              </span>
            )}
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            Login
          </button>
          {errors.root?.message && (
            <div className={styles.networkError}>
              {capitalise(errors.root.message)}
            </div>
          )}
        </form>
        <NavLink to="/register" className={styles.linkButton}>
          Don't have an account? Register
        </NavLink>
      </div>
    </div>
  )
}
