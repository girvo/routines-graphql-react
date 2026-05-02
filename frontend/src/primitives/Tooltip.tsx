import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { resolveSide } from './popover/helpers.ts'
import styles from './Tooltip.module.css'

const SHOW_DELAY_MS = 300
const GAP = 6
const VIEWPORT_MARGIN = 8
const CARET_INSET = 10
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

type TooltipProps = {
  label: string
  side?: 'top' | 'bottom'
  children: ReactNode
}

export const Tooltip = ({ label, side = 'top', children }: TooltipProps) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const showTimerRef = useRef<number | null>(null)
  const tooltipId = useId()

  const clearShowTimer = () => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
  }

  const scheduleShow = useCallback(() => {
    clearShowTimer()
    showTimerRef.current = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS)
  }, [])

  const hideNow = useCallback(() => {
    clearShowTimer()
    setOpen(false)
  }, [])

  useEffect(() => () => clearShowTimer(), [])

  useLayoutEffect(() => {
    if (!open) return
    const content = contentRef.current
    const wrapper = wrapperRef.current
    if (!content || !wrapper) return

    const update = () => {
      const triggerRect = wrapper.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()
      const resolvedSide = resolveSide(
        side,
        triggerRect,
        contentRect.height,
        window.innerHeight,
      )
      const top =
        resolvedSide === 'top'
          ? triggerRect.top - contentRect.height - GAP
          : triggerRect.bottom + GAP
      const triggerCenter = triggerRect.left + triggerRect.width / 2
      const rawLeft = triggerCenter - contentRect.width / 2
      const maxLeft = window.innerWidth - VIEWPORT_MARGIN - contentRect.width
      const left = Math.max(VIEWPORT_MARGIN, Math.min(rawLeft, maxLeft))
      content.style.top = `${top + window.scrollY}px`
      content.style.left = `${left + window.scrollX}px`
      content.style.visibility = 'visible'

      const caret = caretRef.current
      if (caret) {
        const caretMax = contentRect.width - CARET_INSET
        const caretLeft = Math.max(CARET_INSET, Math.min(triggerCenter - left, caretMax))
        caret.style.left = `${caretLeft}px`
        caret.dataset.side = resolvedSide
      }
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, side])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideNow()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, hideNow])

  useEffect(() => {
    if (!open) return
    const focusable = wrapperRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    if (!focusable) return
    const previous = focusable.getAttribute('aria-describedby')
    focusable.setAttribute(
      'aria-describedby',
      previous ? `${previous} ${tooltipId}` : tooltipId,
    )
    return () => {
      if (previous === null) focusable.removeAttribute('aria-describedby')
      else focusable.setAttribute('aria-describedby', previous)
    }
  }, [open, tooltipId])

  return (
    <>
      <span
        ref={wrapperRef}
        className={styles.trigger}
        onMouseEnter={scheduleShow}
        onMouseLeave={hideNow}
        onFocus={() => setOpen(true)}
        onBlur={hideNow}
      >
        {children}
      </span>
      {open
        ? createPortal(
            <div
              ref={contentRef}
              id={tooltipId}
              role="tooltip"
              className={styles.tooltip}
              style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden' }}
            >
              {label}
              <span ref={caretRef} className={styles.caret} aria-hidden />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
