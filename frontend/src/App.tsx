import { use } from 'react'
import { AuthContext } from './login/AuthContext'
import { Login } from './login/Login'

export default function App() {
  const { accessToken } = use(AuthContext)

  if (!accessToken) {
    return <Login />
  }
  return <div>Hello world</div>
}
