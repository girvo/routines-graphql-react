import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { clsx } from 'clsx'

type MonoSize = 'xs' | 'sm'
type MonoElement = 'code' | 'span' | 'div' | 'pre'

type MonoProps<E extends MonoElement> = {
  size?: MonoSize
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, 'as'>

export const Mono = <E extends MonoElement = 'code'>({
  size = 'sm',
  as,
  className,
  ...rest
}: MonoProps<E>) => {
  const Tag = (as ?? 'code') as ElementType
  return <Tag className={clsx('typo-mono', `typo-${size}`, className)} {...rest} />
}
