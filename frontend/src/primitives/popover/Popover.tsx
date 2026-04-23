import {
  cloneElement,
  createContext,
  isValidElement,
  use,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { MouseEvent, ReactElement, ReactNode, Ref, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/tailwind.ts'
import { computePosition, type Placement } from './helpers.ts'
import styles from './Popover.module.css'

type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLElement | null>
  contentId: string
  placement: Placement
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

const usePopoverContext = () => {
  const ctx = use(PopoverContext)
  if (!ctx) throw new Error('Popover subcomponents must be rendered inside <Popover>')
  return ctx
}

type PopoverProps = {
  children: ReactNode
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

export const Popover = ({
  children,
  placement = 'bottom-start',
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  const triggerRef = useRef<HTMLElement>(null)
  const contentId = useId()

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentId, placement }}>
      {children}
    </PopoverContext.Provider>
  )
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onClick?: (e: MouseEvent) => void
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-haspopup'?: 'dialog' | 'menu'
}

type PopoverTriggerProps = {
  children: ReactElement<TriggerChildProps>
}

export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  const { open, setOpen, triggerRef, contentId } = usePopoverContext()
  if (!isValidElement<TriggerChildProps>(children)) {
    throw new Error('<PopoverTrigger> requires a single React element child')
  }
  const childOnClick = children.props.onClick
  return cloneElement(children, {
    ref: triggerRef,
    onClick: (e: MouseEvent) => {
      childOnClick?.(e)
      if (!e.defaultPrevented) setOpen(!open)
    },
    'aria-expanded': open,
    'aria-controls': contentId,
    'aria-haspopup': 'dialog',
  })
}

type PopoverContentProps = {
  children: ReactNode
  className?: string
}

export const PopoverContent = ({ children, className }: PopoverContentProps) => {
  const { open, setOpen, triggerRef, contentId, placement } = usePopoverContext()
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open) return
    const content = contentRef.current
    const trigger = triggerRef.current
    if (!content || !trigger) return

    const update = () => {
      const { top, left } = computePosition(
        trigger.getBoundingClientRect(),
        content.getBoundingClientRect(),
        placement,
        {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY,
        },
      )
      content.style.top = `${top}px`
      content.style.left = `${left}px`
      content.style.visibility = 'visible'
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, placement, triggerRef])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (contentRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, setOpen, triggerRef])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      id={contentId}
      role="dialog"
      className={cn(styles.content, className)}
      style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden' }}
    >
      {children}
    </div>,
    document.body,
  )
}
