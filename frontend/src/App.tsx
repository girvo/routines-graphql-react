import { Suspense, use } from 'react'
import { AuthContext } from './login/AuthContext'
import { Login } from './login/Login'
import { Hello } from './Hello'

export default function App() {
  const { accessToken, clearAccessToken } = use(AuthContext)

  if (!accessToken) {
    return <Login />
  }

  return (
    <div>
      <h1>{`Hello, world! ${accessToken}`}</h1>
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
