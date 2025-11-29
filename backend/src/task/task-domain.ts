import { sqliteDateToDate } from '../database/utils.ts'
import { type } from 'arktype'
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
    createdAt: sqliteDateToDate(input.created_at),
    updatedAt: input.updated_at ? sqliteDateToDate(input.updated_at) : null,
    deletedAt: input.deleted_at ? sqliteDateToDate(input.deleted_at) : null,
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

const buildTaskEdge = (task: TaskDomain, edgeRow?: TaskRow) => {
  return {
    node: task,
    cursor: taskCursor.encode({
      createdAt: task.createdAt.toISOString(),
      id: task.id,
    }),
    // and i could put any other edge data I wanted in here I guess
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
  const edges = edgeRows.slice(0, requestedCount).map(row => {
    const task = tableToDomain(row)
    return buildTaskEdge(task, row)
  })

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: false, // how do I do this?
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
    },
  }
}
