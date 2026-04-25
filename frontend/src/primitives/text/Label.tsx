import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { clsx } from 'clsx'

type LabelVariant = 'default' | 'tight'
type LabelElement = 'label' | 'span' | 'div'

type LabelProps<E extends LabelElement> = {
  variant?: LabelVariant
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, 'as'>

export const Label = <E extends LabelElement = 'label'>({
  variant = 'default',
  as,
  className,
  ...rest
}: LabelProps<E>) => {
  const Tag = (as ?? 'label') as ElementType
  const role = variant === 'tight' ? 'typo-label-tight' : 'typo-label'
  return <Tag className={clsx(role, className)} {...rest} />
}
