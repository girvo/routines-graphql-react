import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { clsx } from 'clsx'

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'

type HeadingProps<E extends HeadingElement> = {
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, 'as'>

export const Heading = <E extends HeadingElement = 'h3'>({
  as,
  className,
  ...rest
}: HeadingProps<E>) => {
  const Tag = (as ?? 'h3') as ElementType
  return <Tag className={clsx('typo-title', 'typo-xl', className)} {...rest} />
}
