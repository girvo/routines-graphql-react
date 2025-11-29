import { sqliteDateToDate } from '../database/utils.ts'
import { type } from 'arktype'
import { toGlobalId } from '../globalId.ts'
import type { TaskRow } from './task-repository.ts'

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