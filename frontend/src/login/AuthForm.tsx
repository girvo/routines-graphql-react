import { use, type ReactNode } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { arktypeResolver } from '@hookform/resolvers/arktype'
import { type } from 'arktype'
import { NavLink } from 'react-router-dom'
import { capitalise } from '../utils/text'
import { AuthContext } from '../auth/auth-store'
import {
  loginSchema,
  signupSchema,
  authResponse,
  type AuthFormData,
} from './auth-types'
import { Field } from '../primitives/form/Field'
import { TextInput } from '../primitives/form/TextInput'
import { Button } from '../primitives/Button'
import { Alert } from '../primitives/Alert'
import { Title } from '../primitives/text/Title'
import styles from './AuthForm.module.css'

type AuthFormProps = {
  title: ReactNode
  submitLabel: string
  endpoint: string
  withName?: boolean
  onSuccess?: () => void
  footer: ReactNode
}

export const AuthForm = ({
  title,
  submitLabel,
  endpoint,
  withName = false,
  onSuccess,
  footer,
}: AuthFormProps) => {
  const { setAccessToken } = use(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AuthFormData>({
    resolver: arktypeResolver(
      withName ? signupSchema : loginSchema,
    ) as unknown as Resolver<AuthFormData>,
    defaultValues: { email: '', name: '', password: '' },
  })

  const onSubmit = async (data: AuthFormData) => {
    const payload = withName
      ? { email: data.email, name: data.name, password: data.password }
      : { email: data.email, password: data.password }
    try {
      const httpResponse = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      })

      const json = await httpResponse.json()

      if (!httpResponse.ok) {
        setError('root', {
          message: json.message || json.error || 'Request failed',
        })
        return
      }

      const validatedResponse = authResponse(json)

      if (validatedResponse instanceof type.errors) {
        console.error('Invalid response from server:', validatedResponse.summary)
        setError('root', { message: 'Invalid server response' })
        return
      }

      if (validatedResponse.success) {
        setAccessToken(validatedResponse.accessToken)
        onSuccess?.()
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

  const emailError =
    !isSubmitting && errors.email?.message
      ? capitalise(errors.email.message)
      : undefined
  const nameError =
    !isSubmitting && errors.name?.message
      ? capitalise(errors.name.message)
      : undefined
  const passwordError =
    !isSubmitting && errors.password?.message
      ? capitalise(errors.password.message)
      : undefined

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Title size="md" className={styles.title}>
          {title}
        </Title>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {withName && (
            <Field label="Name" hideLabel error={nameError}>
              <TextInput
                type="text"
                placeholder="Name"
                error={Boolean(nameError)}
                disabled={isSubmitting}
                {...register('name')}
              />
            </Field>
          )}
          <Field label="Email" hideLabel error={emailError}>
            <TextInput
              type="email"
              placeholder="Email"
              error={Boolean(emailError)}
              disabled={isSubmitting}
              {...register('email')}
            />
          </Field>
          <Field label="Password" hideLabel error={passwordError}>
            <TextInput
              type="password"
              placeholder="Password"
              error={Boolean(passwordError)}
              disabled={isSubmitting}
              {...register('password')}
            />
          </Field>
          <Button type="submit" variant="primary" loading={isSubmitting} fullWidth>
            {submitLabel}
          </Button>
          {errors.root?.message && (
            <Alert type="error">{capitalise(errors.root.message)}</Alert>
          )}
        </form>
        {footer}
      </div>
    </div>
  )
}

type AuthFormFooterLinkProps = { to: string; children: ReactNode }

export const AuthFormFooterLink = ({ to, children }: AuthFormFooterLinkProps) => (
  <NavLink to={to} className={styles.footerLink}>
    {children}
  </NavLink>
)
