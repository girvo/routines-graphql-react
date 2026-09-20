import { AuthForm, AuthFormFooterLink } from './AuthForm'

export const Login = () => (
  <AuthForm
    title="Login"
    submitLabel="Login"
    endpoint="/api/login"
    footer={
      <AuthFormFooterLink to="/register">
        Don&apos;t have an account? Register
      </AuthFormFooterLink>
    }
  />
)
