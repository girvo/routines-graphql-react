import { type } from 'arktype'
import { parseISO } from 'date-fns'
import { toGlobalId } from '../globalId.ts'
import {
  taskCompletionCursor,
  type TaskCompletionRow,
} from './task-completion-repository.ts'
import type { PageInfo } from '../graphql/resolver-types.ts'

const TaskCompletionDomain = type({
  id: 'number',
  userId: 'number',
  routineSlotId: 'number',
  completedAt: 'Date',
  createdAt: 'Date',
})

export type TaskCompletionDomain = typeof TaskCompletionDomain.infer

export const tableToDomain = (
  input: TaskCompletionRow,
): TaskCompletionDomain => {
  return TaskCompletionDomain.assert({
    id: input.id,
    userId: input.user_id,
    routineSlotId: input.routine_slot_id,
    completedAt: parseISO(input.completed_at),
    createdAt: parseISO(input.created_at),
  })
}

export const taskCompletionToGraphQL = (completion: TaskCompletionDomain) => ({
  __typename: 'TaskCompletion' as const,
  id: toGlobalId('TaskCompletion', completion.id),
  routineSlot: {
    id: toGlobalId('RoutineSlot', completion.routineSlotId),
  },
  userId: completion.userId,
  completedAt: completion.completedAt,
  createdAt: completion.createdAt,
})

export type TaskCompletionNode = ReturnType<typeof taskCompletionToGraphQL>

export const buildTaskCompletionEdge = (completion: TaskCompletionDomain) => {
  return {
    node: completion,
    cursor: taskCompletionCursor.encode({
      completedAt: completion.completedAt.toISOString(),
      id: completion.id,
    }),
  }
}

export interface TaskCompletionConnection {
  edges: ReturnType<typeof buildTaskCompletionEdge>[]
  pageInfo: PageInfo
}

export const buildTaskCompletionConnection = (
  edgeRows: TaskCompletionRow[],
  requestedCount: number,
): TaskCompletionConnection => {
  const hasNextPage = edgeRows.length > requestedCount
  const edges = edgeRows
    .slice(0, requestedCount)
    .map(tableToDomain)
    .map(buildTaskCompletionEdge)

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
