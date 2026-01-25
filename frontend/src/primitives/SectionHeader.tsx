import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  action?: ReactNode
}

export const SectionHeader = ({ title, action }: SectionHeaderProps) => (
  <div className="flex items-center">
    <h2 className="card-title flex-1">{title}</h2>
    {action}
  </div>
)
