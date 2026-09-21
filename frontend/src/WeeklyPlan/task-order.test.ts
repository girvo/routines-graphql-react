import { describe, expect, it } from 'vitest'
import {
  applyMove,
  moveTargetForCommand,
  moveTargetForDrop,
  type MoveCommand,
} from './task-order.ts'

const ALL_COMMANDS: MoveCommand[] = ['up', 'down', 'top', 'bottom']

describe('moveTargetForCommand', () => {
  it('refuses to move the first row up or the last row down', () => {
    expect(moveTargetForCommand(['A', 'B', 'C'], 'A', 'up')).toBeNull()
    expect(moveTargetForCommand(['A', 'B', 'C'], 'C', 'down')).toBeNull()
  })

  it('names the destination rather than a neighbour at the edges', () => {
    expect(moveTargetForCommand(['A', 'B', 'C'], 'B', 'up')).toEqual({
      to: 'TOP',
    })
    expect(moveTargetForCommand(['A', 'B', 'C'], 'B', 'down')).toEqual({
      to: 'BOTTOM',
    })
  })

  it('names the exact neighbour for a middle move', () => {
    expect(moveTargetForCommand(['A', 'B', 'C', 'D'], 'C', 'up')).toEqual({
      beforeRoutineSlotId: 'B',
    })
    expect(moveTargetForCommand(['A', 'B', 'C', 'D'], 'B', 'down')).toEqual({
      afterRoutineSlotId: 'C',
    })
    expect(
      moveTargetForCommand(['A', 'B', 'C', 'D', 'E'], 'C', 'down'),
    ).toEqual({ afterRoutineSlotId: 'D' })
  })

  it('jumps to the ends from the middle', () => {
    expect(moveTargetForCommand(['A', 'B', 'C', 'D'], 'C', 'top')).toEqual({
      to: 'TOP',
    })
    expect(moveTargetForCommand(['A', 'B', 'C', 'D'], 'B', 'bottom')).toEqual({
      to: 'BOTTOM',
    })
  })

  it('refuses a jump the row is already at', () => {
    expect(moveTargetForCommand(['A', 'B', 'C'], 'A', 'top')).toBeNull()
    expect(moveTargetForCommand(['A', 'B', 'C'], 'C', 'bottom')).toBeNull()
  })

  it('offers nothing for a single row or an id from another list', () => {
    for (const command of ALL_COMMANDS) {
      expect(moveTargetForCommand(['A'], 'A', command)).toBeNull()
      expect(moveTargetForCommand(['A', 'B'], 'Z', command)).toBeNull()
      expect(moveTargetForCommand([], 'A', command)).toBeNull()
    }
  })

  it('only ever returns a target that changes the order', () => {
    const ids = ['A', 'B', 'C', 'D', 'E']
    for (const movedId of ids) {
      for (const command of ALL_COMMANDS) {
        const target = moveTargetForCommand(ids, movedId, command)
        if (target === null) continue
        expect(
          applyMove(ids, movedId, target),
          `${movedId} ${command}`,
        ).not.toEqual(ids)
      }
    }
  })
})

describe('moveTargetForDrop', () => {
  it('treats the outer edges as the ends of the list', () => {
    expect(moveTargetForDrop(['A', 'B', 'C'], 'C', 'before', 0)).toEqual({
      to: 'TOP',
    })
    expect(moveTargetForDrop(['A', 'B', 'C'], 'A', 'after', 2)).toEqual({
      to: 'BOTTOM',
    })
  })

  it('refuses a drop on the row itself or into its own gap', () => {
    expect(moveTargetForDrop(['A', 'B', 'C'], 'B', 'before', 1)).toBeNull()
    expect(moveTargetForDrop(['A', 'B', 'C'], 'B', 'after', 1)).toBeNull()
    expect(moveTargetForDrop(['A', 'B', 'C', 'D'], 'B', 'before', 2)).toBeNull()
    expect(moveTargetForDrop(['A', 'B', 'C', 'D'], 'B', 'after', 0)).toBeNull()
  })

  it('lands a downward drop after the anchor', () => {
    expect(moveTargetForDrop(['A', 'B', 'C', 'D'], 'A', 'after', 2)).toEqual({
      afterRoutineSlotId: 'C',
    })
    expect(
      applyMove(['A', 'B', 'C', 'D'], 'A', { afterRoutineSlotId: 'C' }),
    ).toEqual(['B', 'C', 'A', 'D'])
  })

  it('lands an upward drop before the anchor', () => {
    expect(moveTargetForDrop(['A', 'B', 'C', 'D'], 'D', 'before', 1)).toEqual({
      beforeRoutineSlotId: 'B',
    })
    expect(
      applyMove(['A', 'B', 'C', 'D'], 'D', { beforeRoutineSlotId: 'B' }),
    ).toEqual(['A', 'D', 'B', 'C'])
  })

  it('offers nothing for a single row or a foreign id', () => {
    expect(moveTargetForDrop(['A'], 'A', 'before', 0)).toBeNull()
    expect(moveTargetForDrop(['A'], 'A', 'after', 0)).toBeNull()
    expect(moveTargetForDrop(['A', 'B'], 'Z', 'before', 0)).toBeNull()
    expect(moveTargetForDrop([], 'A', 'before', 0)).toBeNull()
  })

  it('refuses an anchor outside the visible list or not a row index', () => {
    expect(moveTargetForDrop(['A', 'B', 'C'], 'C', 'before', -1)).toBeNull()
    expect(moveTargetForDrop(['A', 'B', 'C'], 'A', 'after', 3)).toBeNull()
    expect(
      moveTargetForDrop(['A', 'B', 'C'], 'A', 'after', Number.NaN),
    ).toBeNull()
    expect(moveTargetForDrop(['A', 'B', 'C'], 'A', 'after', 1.5)).toBeNull()
    expect(
      moveTargetForDrop(['A', 'B', 'C'], 'A', 'after', Infinity),
    ).toBeNull()
  })

  it('only ever returns a target that changes the order', () => {
    const ids = ['A', 'B', 'C', 'D', 'E']
    for (const movedId of ids) {
      for (const relation of ['before', 'after'] as const) {
        for (let anchorIndex = 0; anchorIndex < ids.length; anchorIndex++) {
          const target = moveTargetForDrop(ids, movedId, relation, anchorIndex)
          if (target === null) continue
          expect(
            applyMove(ids, movedId, target),
            `${movedId} ${relation} index ${anchorIndex}`,
          ).not.toEqual(ids)
        }
      }
    }
  })
})

describe('applyMove', () => {
  it('moves to the top and the bottom', () => {
    expect(applyMove(['A', 'B', 'C', 'D'], 'D', { to: 'TOP' })).toEqual([
      'D',
      'A',
      'B',
      'C',
    ])
    expect(applyMove(['A', 'B', 'C', 'D'], 'A', { to: 'BOTTOM' })).toEqual([
      'B',
      'C',
      'D',
      'A',
    ])
  })

  it('inserts before and after an anchor', () => {
    expect(
      applyMove(['A', 'B', 'C', 'D'], 'A', { beforeRoutineSlotId: 'C' }),
    ).toEqual(['B', 'A', 'C', 'D'])
    expect(
      applyMove(['A', 'B', 'C', 'D'], 'D', { afterRoutineSlotId: 'B' }),
    ).toEqual(['A', 'B', 'D', 'C'])
  })

  it('leaves the order alone for a self anchor', () => {
    expect(
      applyMove(['A', 'B', 'C'], 'B', { beforeRoutineSlotId: 'B' }),
    ).toEqual(['A', 'B', 'C'])
    expect(
      applyMove(['A', 'B', 'C'], 'B', { afterRoutineSlotId: 'B' }),
    ).toEqual(['A', 'B', 'C'])
  })

  it('keeps every id exactly once in a dense order', () => {
    const ids = ['A', 'B', 'C', 'D', 'E']
    const targets = [
      { to: 'TOP' as const },
      { to: 'BOTTOM' as const },
      ...ids.flatMap(id => [
        { beforeRoutineSlotId: id },
        { afterRoutineSlotId: id },
      ]),
    ]

    for (const movedId of ids) {
      for (const target of targets) {
        const next = applyMove(ids, movedId, target)
        expect(next).toHaveLength(ids.length)
        expect([...next].sort()).toEqual([...ids].sort())
        expect(next.filter(id => id === movedId)).toEqual([movedId])
      }
    }
  })

  it('handles one- and two-item lists', () => {
    expect(applyMove(['A'], 'A', { to: 'TOP' })).toEqual(['A'])
    expect(applyMove(['A'], 'A', { to: 'BOTTOM' })).toEqual(['A'])
    expect(applyMove(['A', 'B'], 'A', { to: 'BOTTOM' })).toEqual(['B', 'A'])
    expect(applyMove(['A', 'B'], 'B', { to: 'TOP' })).toEqual(['B', 'A'])
    expect(applyMove(['A', 'B'], 'A', { afterRoutineSlotId: 'B' })).toEqual([
      'B',
      'A',
    ])
    expect(applyMove(['A', 'B'], 'B', { beforeRoutineSlotId: 'A' })).toEqual([
      'B',
      'A',
    ])
  })

  it('leaves the order alone when the ids are not in this list', () => {
    expect(applyMove(['A', 'B'], 'Z', { to: 'TOP' })).toEqual(['A', 'B'])
    expect(applyMove(['A', 'B'], 'A', { beforeRoutineSlotId: 'Z' })).toEqual([
      'A',
      'B',
    ])
  })

  it('does not mutate the order it was given', () => {
    const ids = ['A', 'B', 'C']
    applyMove(ids, 'C', { to: 'TOP' })
    expect(ids).toEqual(['A', 'B', 'C'])
  })
})

describe('command and drop targets agree with the settled order', () => {
  const ids = ['A', 'B', 'C', 'D']

  it('matches the order a user sees for each command', () => {
    const expected: Record<MoveCommand, Record<string, string[] | null>> = {
      up: {
        A: null,
        B: ['B', 'A', 'C', 'D'],
        C: ['A', 'C', 'B', 'D'],
        D: ['A', 'B', 'D', 'C'],
      },
      down: {
        A: ['B', 'A', 'C', 'D'],
        B: ['A', 'C', 'B', 'D'],
        C: ['A', 'B', 'D', 'C'],
        D: null,
      },
      top: {
        A: null,
        B: ['B', 'A', 'C', 'D'],
        C: ['C', 'A', 'B', 'D'],
        D: ['D', 'A', 'B', 'C'],
      },
      bottom: {
        A: ['B', 'C', 'D', 'A'],
        B: ['A', 'C', 'D', 'B'],
        C: ['A', 'B', 'D', 'C'],
        D: null,
      },
    }

    for (const command of ALL_COMMANDS) {
      for (const movedId of ids) {
        const target = moveTargetForCommand(ids, movedId, command)
        if (expected[command][movedId] === null) {
          expect(target, `${movedId} ${command}`).toBeNull()
          continue
        }
        expect(
          target && applyMove(ids, movedId, target),
          `${movedId} ${command}`,
        ).toEqual(expected[command][movedId])
      }
    }
  })

  it('reports the position the announcement needs', () => {
    const target = moveTargetForCommand(ids, 'D', 'up')
    if (target === null) throw new Error('expected a move target')

    const next = applyMove(ids, 'D', target)
    expect(next.indexOf('D') + 1).toBe(3)
    expect(next).toHaveLength(ids.length)
  })
})
