import { type } from 'arktype'
import { parseISO } from 'date-fns'
import { toGlobalId } from '../globalId.ts'
import { taskCursor, type TaskRow } from './task-repository.ts'
import type { PageInfo } from '../graphql/resolver-types.ts'

const TaskDomain = type({
  id: 'number',
  userId: 'number',
  title: 'string',
  createdAt: 'Date',
  updatedAt: 'Date | null',
  deletedAt: 'Date | null',
})

export type TaskDomain = typeof TaskDomain.infer

export const tableToDomain = (input: TaskRow): TaskDomain => {
  return TaskDomain.assert({
    id: input.id,
    userId: input.user_id,
    title: input.title,
    createdAt: parseISO(input.created_at),
    updatedAt: input.updated_at ? parseISO(input.updated_at) : null,
    deletedAt: input.deleted_at ? parseISO(input.deleted_at) : null,
  })
}

export const taskToGraphQL = (task: TaskDomain) => ({
  __typename: 'Task' as const,
  id: toGlobalId('Task', task.id),
  title: task.title,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
})

export type TaskNode = ReturnType<typeof taskToGraphQL>

export const buildTaskEdge = (task: TaskDomain) => {
  return {
    node: task,
    cursor: taskCursor.encode({
      createdAt: task.createdAt.toISOString(),
      id: task.id,
    }),
  }
}

export interface TaskConnection {
  edges: ReturnType<typeof buildTaskEdge>[]
  pageInfo: PageInfo
}

export const buildTaskConnection = (
  edgeRows: TaskRow[],
  requestedCount: number,
): TaskConnection => {
  const hasNextPage = edgeRows.length > requestedCount
  const edges = edgeRows
    .slice(0, requestedCount)
    .map(tableToDomain)
    .map(buildTaskEdge)

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
