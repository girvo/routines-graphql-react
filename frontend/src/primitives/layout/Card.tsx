import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { clsx } from 'clsx'
import styles from './Card.module.css'

type CardElement = 'div' | 'section' | 'article' | 'aside'

type CardProps<E extends CardElement> = {
  as?: E
  responsive?: boolean
} & Omit<ComponentPropsWithoutRef<E>, 'as'>

export const Card = <E extends CardElement = 'div'>({
  as,
  responsive = false,
  className,
  ...rest
}: CardProps<E>) => {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      className={clsx(responsive ? styles.cardResponsive : styles.card, className)}
      {...rest}
    />
  )
}

export const CardBody = ({ className, ...rest }: ComponentPropsWithoutRef<'div'>) => (
  <div className={clsx(styles.body, className)} {...rest} />
)
