import { describe, expect, it } from 'vitest'
import { changedPositions } from '../../src/routine-slot/routine-slot-repository.ts'

const rows = (...positions: [number, number][]) =>
  positions.map(([id, position]) => ({ id, position }))

describe('changedPositions', () => {
  it('writes nothing when every row already holds its wanted position', () => {
    expect(changedPositions(rows([1, 0], [2, 1], [3, 2]), [1, 2, 3])).toEqual(
      [],
    )
  })

  it('reports only the rows that must move', () => {
    expect(changedPositions(rows([1, 0], [2, 1], [3, 2]), [2, 1, 3])).toEqual([
      { id: 2, position: 0 },
      { id: 1, position: 1 },
    ])
  })

  it('leaves the row that stays in place out of a reversal', () => {
    expect(changedPositions(rows([1, 0], [2, 1], [3, 2]), [3, 2, 1])).toEqual([
      { id: 3, position: 0 },
      { id: 1, position: 2 },
    ])
  })

  it('renumbers the tail densely after a row has been removed', () => {
    expect(changedPositions(rows([5, 0], [7, 2]), [5, 7])).toEqual([
      { id: 7, position: 1 },
    ])
  })

  it('keys on the stored position rather than the order currentRows arrives in', () => {
    expect(changedPositions(rows([2, 0], [1, 1]), [2, 1])).toEqual([])
    expect(changedPositions(rows([3, 2], [1, 0], [2, 1]), [3, 2, 1])).toEqual([
      { id: 3, position: 0 },
      { id: 1, position: 2 },
    ])
  })

  it('repairs a row whose stored position is not dense', () => {
    expect(changedPositions(rows([1, 5]), [1])).toEqual([
      { id: 1, position: 0 },
    ])
  })

  it('writes nothing for an empty day and section', () => {
    expect(changedPositions([], [])).toEqual([])
  })

  it('reports an id that no current row carries', () => {
    expect(changedPositions(rows([1, 0]), [1, 9])).toEqual([
      { id: 9, position: 1 },
    ])
  })
})
