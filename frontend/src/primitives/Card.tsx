import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import styles from './Card.module.css'

export const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.card, className)} {...rest} />
)

export const CardBody = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.body, className)} {...rest} />
)
