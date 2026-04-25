import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { clsx } from 'clsx'

type BodySize = 'sm' | 'md' | 'lg'
type BodyElement = 'p' | 'span' | 'div' | 'label'

type BodyProps<E extends BodyElement> = {
  size?: BodySize
  strong?: boolean
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, 'as'>

const sizeClass: Record<BodySize, string> = {
  sm: 'typo-md',
  md: 'typo-lg',
  lg: 'typo-xl',
}

export const Body = <E extends BodyElement = 'p'>({
  size = 'md',
  strong = false,
  as,
  className,
  ...rest
}: BodyProps<E>) => {
  const Tag = (as ?? 'p') as ElementType
  return (
    <Tag
      className={clsx('typo-body', sizeClass[size], strong && 'typo-medium', className)}
      {...rest}
    />
  )
}
