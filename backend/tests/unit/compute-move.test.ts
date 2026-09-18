import { describe, expect, it } from 'vitest'
import {
  computeMove,
  RoutineSlotNotInOrderError,
  type RoutineSlotMoveTarget,
} from '../../src/routine-slot/routine-slot-repository.ts'

const sortedIds = (ids: number[]) => [...ids].sort((a, b) => a - b)

const captureError = (run: () => unknown): unknown => {
  try {
    run()
    return undefined
  } catch (error) {
    return error
  }
}

describe('computeMove', () => {
  describe('relative targets', () => {
    it('moves a slot before an anchor', () => {
      expect(
        computeMove([1, 2, 3, 4], 4, { kind: 'before', anchorId: 1 }),
      ).toEqual([4, 1, 2, 3])
    })

    it('moves a slot before a middle anchor', () => {
      expect(
        computeMove([1, 2, 3, 4], 1, { kind: 'before', anchorId: 3 }),
      ).toEqual([2, 1, 3, 4])
      expect(
        computeMove([4, 2, 3, 1], 4, { kind: 'before', anchorId: 3 }),
      ).toEqual([2, 4, 3, 1])
    })

    it('moves a slot after an anchor', () => {
      expect(
        computeMove([1, 2, 3, 4], 1, { kind: 'after', anchorId: 3 }),
      ).toEqual([2, 3, 1, 4])
    })

    it('moves a slot after the last anchor', () => {
      expect(computeMove([1, 2, 3], 1, { kind: 'after', anchorId: 3 })).toEqual(
        [2, 3, 1],
      )
    })

    it('moves a slot before and after itself without changing the order', () => {
      expect(
        computeMove([1, 2, 3], 2, { kind: 'before', anchorId: 2 }),
      ).toEqual([1, 2, 3])
      expect(computeMove([1, 2, 3], 2, { kind: 'after', anchorId: 2 })).toEqual(
        [1, 2, 3],
      )
    })
  })

  describe('absolute targets', () => {
    it('moves a slot to the top', () => {
      expect(computeMove([1, 2, 3], 3, { kind: 'top' })).toEqual([3, 1, 2])
    })

    it('moves a slot to the bottom', () => {
      expect(computeMove([3, 1, 2], 3, { kind: 'bottom' })).toEqual([1, 2, 3])
    })
  })

  describe('no-op moves', () => {
    it('returns an identical order when the slot is already first and moved to the top', () => {
      expect(computeMove([1, 2, 3], 1, { kind: 'top' })).toEqual([1, 2, 3])
    })

    it('returns an identical order when the slot is already last and moved to the bottom', () => {
      expect(computeMove([1, 2, 3], 3, { kind: 'bottom' })).toEqual([1, 2, 3])
    })

    it('returns an identical order when the slot already follows the anchor', () => {
      expect(computeMove([1, 2, 3], 2, { kind: 'after', anchorId: 1 })).toEqual(
        [1, 2, 3],
      )
    })

    it('returns an identical order when the slot already precedes the anchor', () => {
      expect(
        computeMove([1, 2, 3], 2, { kind: 'before', anchorId: 3 }),
      ).toEqual([1, 2, 3])
    })
  })

  describe('single-slot order', () => {
    const targets: RoutineSlotMoveTarget[] = [
      { kind: 'top' },
      { kind: 'bottom' },
      { kind: 'before', anchorId: 7 },
      { kind: 'after', anchorId: 7 },
    ]

    it('returns the same single slot for every target', () => {
      for (const target of targets) {
        expect(computeMove([7], 7, target)).toEqual([7])
      }
    })
  })

  describe('unknown ids', () => {
    it('reports an unknown anchor before an anchor that is not in the order', () => {
      const error = captureError(() =>
        computeMove([1, 2, 3], 1, { kind: 'before', anchorId: 99 }),
      )

      expect(error).toBeInstanceOf(RoutineSlotNotInOrderError)
      expect((error as RoutineSlotNotInOrderError).slotId).toBe(99)
      expect((error as RoutineSlotNotInOrderError).message).toContain('99')
    })

    it('reports an unknown anchor after an anchor that is not in the order', () => {
      const error = captureError(() =>
        computeMove([1, 2, 3], 1, { kind: 'after', anchorId: 99 }),
      )

      expect(error).toBeInstanceOf(RoutineSlotNotInOrderError)
      expect((error as RoutineSlotNotInOrderError).slotId).toBe(99)
    })

    it('reports an unknown moved slot instead of returning an order', () => {
      const error = captureError(() =>
        computeMove([1, 2, 3], 99, { kind: 'top' }),
      )

      expect(error).toBeInstanceOf(RoutineSlotNotInOrderError)
      expect((error as RoutineSlotNotInOrderError).slotId).toBe(99)
    })

    it('reports an unknown moved slot even when the target names it too', () => {
      const error = captureError(() =>
        computeMove([1, 2, 3], 99, { kind: 'before', anchorId: 99 }),
      )

      expect(error).toBeInstanceOf(RoutineSlotNotInOrderError)
      expect((error as RoutineSlotNotInOrderError).slotId).toBe(99)
    })
  })

  describe('purity', () => {
    const cases: Array<[number[], number, RoutineSlotMoveTarget]> = [
      [[1, 2, 3, 4], 4, { kind: 'before', anchorId: 1 }],
      [[1, 2, 3, 4], 1, { kind: 'after', anchorId: 3 }],
      [[1, 2, 3, 4], 4, { kind: 'top' }],
      [[1, 2, 3, 4], 1, { kind: 'bottom' }],
      [[5], 5, { kind: 'top' }],
    ]

    it('never mutates the input order', () => {
      for (const [currentOrder, movedId, target] of cases) {
        const before = [...currentOrder]
        computeMove(currentOrder, movedId, target)
        expect(currentOrder).toEqual(before)
      }
    })

    it('returns a permutation of the input order', () => {
      for (const [currentOrder, movedId, target] of cases) {
        const result = computeMove(currentOrder, movedId, target)
        expect(result).not.toBe(currentOrder)
        expect(sortedIds(result)).toEqual(sortedIds(currentOrder))
      }
    })

    it('places the moved slot at the position each target implies', () => {
      const order = [1, 2, 3, 4]
      expect(
        computeMove(order, 3, { kind: 'before', anchorId: 1 }).indexOf(3),
      ).toBe(0)
      expect(
        computeMove(order, 3, { kind: 'after', anchorId: 4 }).indexOf(3),
      ).toBe(3)
      expect(computeMove(order, 3, { kind: 'top' }).indexOf(3)).toBe(0)
      expect(computeMove(order, 3, { kind: 'bottom' }).indexOf(3)).toBe(3)
      expect(
        computeMove(order, 3, { kind: 'before', anchorId: 2 }).indexOf(3),
      ).toBe(1)
      expect(
        computeMove(order, 3, { kind: 'after', anchorId: 2 }).indexOf(3),
      ).toBe(2)
    })
  })
})
