import type { ReactNode } from 'react'

interface TaskFormCellProps {
  variant: 'first' | 'field' | 'empty' | 'actions'
  children?: ReactNode
}

export const TaskFormCell = ({ variant, children }: TaskFormCellProps) => {
  if (variant === 'first') {
    return (
      <td className="block p-4 pb-2 md:table-cell md:p-3 md:align-top">
        <div className="flex flex-col">{children}</div>
      </td>
    )
  }

  if (variant === 'field') {
    return (
      <td className="block px-4 pb-2 md:table-cell md:p-3 md:align-top">
        <div className="flex flex-col">{children}</div>
      </td>
    )
  }

  if (variant === 'empty') {
    return <td className="hidden md:table-cell md:p-3 md:align-top"></td>
  }

  if (variant === 'actions') {
    return (
      <td className="border-base-300 block border-t p-0 md:table-cell md:border-t-0 md:p-3 md:align-top md:text-center">
        {children}
      </td>
    )
  }

  return null
}
