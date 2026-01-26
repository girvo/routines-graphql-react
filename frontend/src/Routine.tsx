import { Suspense } from 'react'
import { Hello } from './Hello'

export const Routine = () => {
  return (
    <div className="flex-1">
      <h1>Hello, world!</h1>
      <hr />
      <Suspense>
        <Hello />
      </Suspense>
    </div>
  )
}
