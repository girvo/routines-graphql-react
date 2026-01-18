import type { ReactNode } from 'react'

interface TaskFormRowProps {
  children: ReactNode
}

export const TaskFormRow = ({ children }: TaskFormRowProps) => {
  return (
    <tr className="bg-base-200 block rounded-lg md:table-row md:rounded-none md:bg-transparent">
      {children}
    </tr>
  )
}
