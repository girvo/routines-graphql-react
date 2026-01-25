import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
}

export const Card = ({ children }: CardProps) => (
  <div className="card card-border bg-base-100">{children}</div>
)

interface CardBodyProps {
  children: ReactNode
}

export const CardBody = ({ children }: CardBodyProps) => (
  <div className="card-body">{children}</div>
)
