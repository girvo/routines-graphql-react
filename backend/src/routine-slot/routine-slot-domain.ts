import { type } from 'arktype'
import { parseISO } from 'date-fns'
import { toGlobalId, type GlobalId } from '../globalId.ts'
import {
  routineSlotCursor,
  type RoutineSlotRow,
} from './routine-slot-repository.ts'
import type { PageInfo } from '../graphql/resolver-types.ts'

const RoutineSlotDomain = type({
  id: 'number',
  userId: 'number',
  taskId: 'number',
  dayOfWeek:
    "'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'",
  section: "'MORNING' | 'MIDDAY' | 'EVENING'",
  createdAt: 'Date',
  deletedAt: 'Date | null',
})

export type RoutineSlotDomain = typeof RoutineSlotDomain.infer

export const tableToDomain = (input: RoutineSlotRow): RoutineSlotDomain => {
  return RoutineSlotDomain.assert({
    id: input.id,
    userId: input.user_id,
    taskId: input.task_id,
    dayOfWeek: input.day_of_week,
    section: input.section,
    createdAt: parseISO(input.created_at),
    deletedAt: input.deleted_at ? parseISO(input.deleted_at) : null,
  })
}

export const routineSlotToGraphQL = (slot: RoutineSlotDomain) => ({
  __typename: 'RoutineSlot' as const,
  id: toGlobalId('RoutineSlot', slot.id),
  task: { id: toGlobalId('Task', slot.taskId) },
  dayOfWeek: slot.dayOfWeek,
  section: slot.section,
  createdAt: slot.createdAt,
})

export type RoutineSlotNode = ReturnType<typeof routineSlotToGraphQL>

export const buildRoutineSlotEdge = (slot: RoutineSlotDomain) => {
  return {
    node: slot,
    cursor: routineSlotCursor.encode({
      createdAt: slot.createdAt.toISOString(),
      id: slot.id,
    }),
  }
}

export interface RoutineSlotConnection {
  edges: ReturnType<typeof buildRoutineSlotEdge>[]
  pageInfo: PageInfo
}

export const buildRoutineSlotConnection = (
  edgeRows: RoutineSlotRow[],
  requestedCount: number,
): RoutineSlotConnection => {
  const hasNextPage = edgeRows.length > requestedCount
  const edges = edgeRows
    .slice(0, requestedCount)
    .map(tableToDomain)
    .map(buildRoutineSlotEdge)

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: false,
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
    },
  }
}
