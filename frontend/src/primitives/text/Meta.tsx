import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '../../utils/tailwind.ts'

type MetaElement = 'p' | 'span' | 'div' | 'small' | 'label'

type BaseProps<E extends MetaElement> = {
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, 'as'>

type MetaProps<E extends MetaElement> =
  | (BaseProps<E> & { strong?: false; size?: 'xs' | 'sm' | 'md' })
  | (BaseProps<E> & { strong: true; size?: 'sm' | 'md' })

const sizeClass = { xs: 'typo-xs', sm: 'typo-md', md: 'typo-sm' } as const

export const Meta = <E extends MetaElement = 'span'>({
  size = 'md',
  strong = false,
  as,
  className,
  ...rest
}: MetaProps<E>) => {
  const Tag = (as ?? 'span') as ElementType
  return (
    <Tag
      className={cn('typo-body', sizeClass[size], strong && 'typo-medium', className)}
      {...rest}
    />
  )
}
