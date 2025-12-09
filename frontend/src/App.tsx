import { useAuthToken } from './login/AuthContext'
import { Login } from './login/Login'

export default function App() {
  const accessToken = useAuthToken()

  if (!accessToken) {
    return <Login />
  }
  return <div>Hello world</div>
}
