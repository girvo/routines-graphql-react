import { cn } from '../utils/tailwind'

export const container = cn(
  'flex items-center justify-center p-4 md:min-h-screen',
)
export const card = cn(
  'card bg-base-100 border-base-300 border shadow-xl',
  'w-full md:w-96',
  'p-8',
)
export const formGroup = cn('form-control w-full')
export const input = cn('input input-bordered w-full')
export const submitButton = cn('btn btn-primary mt-1 w-full')
export const linkButton = cn('btn btn-ghost mt-2 w-full')
