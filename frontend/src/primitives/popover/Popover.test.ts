import { describe, expect, it } from 'vitest'
import { computePosition, resolveLeft, resolveSide } from './helpers.ts'

const rect = ({
  top = 0,
  left = 0,
  width = 0,
  height = 0,
}: Partial<Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>>): DOMRect => ({
  top,
  left,
  width,
  height,
  right: left + width,
  bottom: top + height,
  x: left,
  y: top,
  toJSON() {
    return this
  },
})

const VIEWPORT = { width: 1000, height: 800, scrollX: 0, scrollY: 0 }

describe('resolveSide', () => {
  it('keeps bottom when there is enough room below', () => {
    const trigger = rect({ top: 100, height: 30 })
    expect(resolveSide('bottom', trigger, 200, 800)).toBe('bottom')
  })

  it('flips to top when below is too tight and above has more room', () => {
    const trigger = rect({ top: 700, height: 30 })
    expect(resolveSide('bottom', trigger, 200, 800)).toBe('top')
  })

  it('stays on initial side when both sides are cramped but initial has more room', () => {
    const trigger = rect({ top: 100, height: 30 })
    expect(resolveSide('bottom', trigger, 750, 800)).toBe('bottom')
  })

  it('flips to bottom when initial is top but below has more room', () => {
    const trigger = rect({ top: 50, height: 30 })
    expect(resolveSide('top', trigger, 200, 800)).toBe('bottom')
  })
})

describe('resolveLeft', () => {
  it('aligns to trigger.left for start', () => {
    const trigger = rect({ left: 200, width: 40 })
    expect(resolveLeft('start', trigger, 160, 1000)).toBe(200)
  })

  it('aligns to trigger.right minus content width for end', () => {
    const trigger = rect({ left: 200, width: 40 })
    expect(resolveLeft('end', trigger, 160, 1000)).toBe(80)
  })

  it('clamps to viewport margin when trigger is too far left', () => {
    const trigger = rect({ left: 2, width: 40 })
    expect(resolveLeft('end', trigger, 160, 1000)).toBe(8)
  })

  it('clamps to viewport right edge when content would overflow', () => {
    const trigger = rect({ left: 960, width: 40 })
    expect(resolveLeft('start', trigger, 160, 1000)).toBe(832)
  })
})

describe('computePosition', () => {
  it('places below+start with a gap', () => {
    const trigger = rect({ top: 100, left: 200, width: 40, height: 30 })
    const content = rect({ width: 160, height: 120 })
    expect(computePosition(trigger, content, 'bottom-start', VIEWPORT)).toEqual({
      top: 134,
      left: 200,
    })
  })

  it('places above when bottom-start would overflow and above has room', () => {
    const trigger = rect({ top: 700, left: 200, width: 40, height: 30 })
    const content = rect({ width: 160, height: 200 })
    expect(computePosition(trigger, content, 'bottom-start', VIEWPORT)).toEqual({
      top: 496,
      left: 200,
    })
  })

  it('applies scrollY/scrollX offsets to the returned coordinates', () => {
    const trigger = rect({ top: 100, left: 200, width: 40, height: 30 })
    const content = rect({ width: 160, height: 120 })
    expect(
      computePosition(trigger, content, 'bottom-start', {
        ...VIEWPORT,
        scrollX: 50,
        scrollY: 25,
      }),
    ).toEqual({ top: 159, left: 250 })
  })

  it('shifts horizontally when bottom-end overflows the left edge', () => {
    const trigger = rect({ top: 100, left: 10, width: 40, height: 30 })
    const content = rect({ width: 160, height: 120 })
    expect(computePosition(trigger, content, 'bottom-end', VIEWPORT)).toEqual({
      top: 134,
      left: 8,
    })
  })
})
