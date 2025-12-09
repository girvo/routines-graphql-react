import { cn } from '../utils/tailwind'

const labelContainer = cn('flex gap-2')
const label = cn('label w-20')
const input = cn('input flex-1')

export const Login = () => {
  return (
    <div className="flex p-2 items-start justify-center md:items-center min-h-screen">
      <div className="rounded-lg border p-8 border-gray-400 flex-1 md:max-w-200 flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-4">Login</h1>
        <div className={labelContainer}>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input name="email" className={input} />
        </div>
        <div className={labelContainer}>
          <label className={label} htmlFor="password">
            Password
          </label>
          <input type="password" name="password" className={input} />
        </div>
        <div className="mt-4 flex justify-center">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
