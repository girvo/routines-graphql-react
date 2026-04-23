import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '../../utils/tailwind.ts'

type TitleSize = 'sm' | 'md' | 'lg'
type TitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'

type TitleProps<E extends TitleElement> = {
  size?: TitleSize
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, 'as'>

const sizeClass: Record<TitleSize, string> = {
  sm: 'typo-xl',
  md: 'typo-2xl',
  lg: 'typo-3xl',
}

export const Title = <E extends TitleElement = 'h2'>({
  size = 'md',
  as,
  className,
  ...rest
}: TitleProps<E>) => {
  const Tag = (as ?? 'h2') as ElementType
  return (
    <Tag className={cn('typo-title', sizeClass[size], className)} {...rest} />
  )
}
