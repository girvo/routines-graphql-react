import { Suspense, use } from 'react'
import { AuthContext } from './auth/auth-store'
import { Hello } from './Hello'

export const Routine = () => {
  const { clearAccessToken } = use(AuthContext)

  return (
    <div>
      <h1>Hello, world!</h1>
      <a
        href="#"
        onClick={ev => {
          ev.preventDefault()
          clearAccessToken()
        }}
      >
        Logout
      </a>
      <hr />
      <Suspense>
        <Hello />
      </Suspense>
    </div>
  )
}
