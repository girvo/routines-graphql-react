import { Suspense, use } from 'react'
import { AuthContext } from './login/AuthContext'
import { Login } from './login/Login'
import { Hello } from './Hello'

export default function App() {
  const { hasAccessToken, clearAccessToken } = use(AuthContext)

  if (!hasAccessToken) {
    return <Login />
  }

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
