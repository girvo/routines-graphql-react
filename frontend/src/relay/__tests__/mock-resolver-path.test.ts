import { describe, expect, it } from 'vitest'
import { edgeIndexOf } from './mock-resolver-path.ts'

describe('edgeIndexOf', () => {
  it('reads the list index of the edge a resolver is generating inside', () => {
    expect(
      edgeIndexOf(['daySectionSlots', 'slots', 'edges', '2', 'node']),
    ).toBe(2)
    expect(
      edgeIndexOf(['morning', 'slots', 'edges', '0', 'node', 'task']),
    ).toBe(0)
    expect(edgeIndexOf(['daySectionSlots', 'slots', 'edges', '1'])).toBe(1)
  })

  it('uses the innermost connection when connections nest', () => {
    expect(
      edgeIndexOf([
        'tasks',
        'edges',
        '4',
        'node',
        'slots',
        'edges',
        '1',
        'node',
      ]),
    ).toBe(1)
  })

  it('is null outside any connection edge', () => {
    expect(
      edgeIndexOf(['createRoutineSlot', 'routineSlotEdge', 'node']),
    ).toBeNull()
    expect(edgeIndexOf(['daySectionSlots', 'slots', 'edges'])).toBeNull()
    expect(edgeIndexOf(null)).toBeNull()
  })
})
