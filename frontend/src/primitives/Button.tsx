import type { ButtonHTMLAttributes, ComponentType, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../utils/tailwind.ts'
import styles from './Button.module.css'

type IconComponent = ComponentType<{ className?: string }>

type CommonProps = {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

type LabelledButtonProps = CommonProps & {
  children: ReactNode
  leadingIcon?: IconComponent
  trailingIcon?: IconComponent
  iconOnly?: never
}

type IconOnlyButtonProps = CommonProps & {
  iconOnly: IconComponent
  'aria-label': string
  children?: never
  leadingIcon?: never
  trailingIcon?: never
}

type ButtonProps = LabelledButtonProps | IconOnlyButtonProps

const renderLeading = (loading: boolean, LeadingIcon: IconComponent | undefined) => {
  if (loading) return <Loader2 className={cn(styles.icon, styles.spinner)} aria-hidden />
  if (LeadingIcon) return <LeadingIcon className={styles.icon} />
  return null
}

const renderTrailing = (loading: boolean, TrailingIcon: IconComponent | undefined) => {
  if (loading) return null
  if (TrailingIcon) return <TrailingIcon className={styles.icon} />
  return null
}

export const Button = ({
  variant = 'secondary',
  loading = false,
  type = 'button',
  disabled,
  className,
  ...rest
}: ButtonProps) => {
  const isIconOnly = 'iconOnly' in rest && rest.iconOnly !== undefined
  let body: ReactNode
  let restProps: ButtonHTMLAttributes<HTMLButtonElement>

  if (isIconOnly) {
    const { iconOnly: IconOnly, ...iconRest } = rest as IconOnlyButtonProps
    restProps = iconRest
    if (loading) {
      body = <Loader2 className={cn(styles.icon, styles.spinner)} aria-hidden />
    } else {
      body = <IconOnly className={styles.icon} />
    }
  } else {
    const { leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, children, ...labelRest } =
      rest as LabelledButtonProps
    restProps = labelRest
    body = (
      <>
        {renderLeading(loading, LeadingIcon)}
        {children}
        {renderTrailing(loading, TrailingIcon)}
      </>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        styles.button,
        styles[variant],
        isIconOnly && styles.iconOnly,
        loading && styles.loading,
        className,
      )}
      {...restProps}
    >
      {body}
    </button>
  )
}
