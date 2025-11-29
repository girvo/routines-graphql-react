import { type Context, assertAuthenticated } from '../graphql/context.ts'
import { type TaskDomain, tableToDomain } from './task-domain.ts'
import DataLoader from 'dataloader'

export const taskDataLoader = (context: Context) => {
  assertAuthenticated(context)
  return new DataLoader(async (keys: readonly number[]) => {
    const rows = await context.taskRepo.findAllByIdsAndUserId(
      keys,
      context.currentUser.id,
    )
    const rowMap = new Map<number, TaskDomain | Error>()

    for (const row of rows) {
      try {
        rowMap.set(row.id, tableToDomain(row))
      } catch (error) {
        if (error instanceof Error) {
          rowMap.set(row.id, error)
        } else {
          console.warn(
            'Error received in Task DataLoader that is not an actual error:',
            error,
          )
          rowMap.set(row.id, new Error(String(error)))
        }
      }
    }

    return keys.map(key => rowMap.get(key) ?? null)
  })
}

export type TaskDataLoader = ReturnType<typeof taskDataLoader>
