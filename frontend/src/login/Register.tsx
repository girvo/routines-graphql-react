import { useNavigate } from 'react-router-dom'
import { AuthForm, AuthFormFooterLink } from './AuthForm'

export const Register = () => {
  const navigate = useNavigate()
  return (
    <AuthForm
      title="Register"
      submitLabel="Register"
      endpoint="/api/signup"
      withName
      onSuccess={() => navigate('/', { replace: true })}
      footer={
        <AuthFormFooterLink to="/">
          Already have an account? Login
        </AuthFormFooterLink>
      }
    />
  )
}
