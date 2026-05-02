import { forwardRef, type ButtonHTMLAttributes, type ComponentType, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './Button.module.css'

type IconComponent = ComponentType<{ className?: string }>

type CommonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md'
  align?: 'center' | 'start'
  loading?: boolean
  fullWidth?: boolean
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
  if (loading) return <Loader2 className={clsx(styles.icon, styles.spinner)} aria-hidden />
  if (LeadingIcon) return <LeadingIcon className={styles.icon} />
  return null
}

const renderTrailing = (loading: boolean, TrailingIcon: IconComponent | undefined) => {
  if (loading) return null
  if (TrailingIcon) return <TrailingIcon className={styles.icon} />
  return null
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      align = 'center',
      loading = false,
      fullWidth = false,
      type = 'button',
      disabled,
      className,
      ...rest
    },
    ref,
  ) => {
    const isIconOnly = 'iconOnly' in rest && rest.iconOnly !== undefined
    let body: ReactNode
    let restProps: ButtonHTMLAttributes<HTMLButtonElement>

    if (isIconOnly) {
      const { iconOnly: IconOnly, ...iconRest } = rest as IconOnlyButtonProps
      restProps = iconRest
      if (loading) {
        body = <Loader2 className={clsx(styles.icon, styles.spinner)} aria-hidden />
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
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={clsx(
          styles.button,
          styles[variant],
          styles[size],
          isIconOnly && styles.iconOnly,
          align === 'start' && styles.alignStart,
          loading && styles.loading,
          fullWidth && styles.fullWidth,
          className,
        )}
        {...restProps}
      >
        {body}
      </button>
    )
  },
)

Button.displayName = 'Button'
