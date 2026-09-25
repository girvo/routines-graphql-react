import type { FocusEvent, MouseEvent, PointerEvent } from 'react'
import { NavLink, type NavLinkProps } from 'react-router-dom'
import {
  useLinkDataLoadHandler,
  useLinkResourceLoadHandler,
} from '@loop-payments/react-router-relay'

type PreloadingNavLinkProps = NavLinkProps & { to: string }

export const PreloadingNavLink = ({
  to,
  onMouseEnter,
  onFocus,
  onPointerDown,
  ...props
}: PreloadingNavLinkProps) => {
  const fetchResources = useLinkResourceLoadHandler()
  const fetchData = useLinkDataLoadHandler(to)

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    fetchResources(to)
    onMouseEnter?.(event)
  }

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    fetchResources(to)
    onFocus?.(event)
  }

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    fetchResources(to)
    fetchData()
    onPointerDown?.(event)
  }

  return (
    <NavLink
      to={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onPointerDown={handlePointerDown}
      {...props}
    />
  )
}
