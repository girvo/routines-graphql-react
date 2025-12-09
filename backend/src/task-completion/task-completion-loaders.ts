import { type Context, assertAuthenticated } from '../graphql/context.ts'
import {
  type TaskCompletionDomain,
  tableToDomain,
} from './task-completion-domain.ts'
import DataLoader from 'dataloader'

export const taskCompletionDataLoader = (context: Context) => {
  return new DataLoader(async (keys: readonly number[]) => {
    assertAuthenticated(context)
    const rows = await context.taskCompletionRepo.findAllByIdsAndUserId(
      keys,
      context.currentUser.id,
    )
    const rowMap = new Map<number, TaskCompletionDomain | Error>()

    for (const row of rows) {
      try {
        const completion = tableToDomain(row)
        rowMap.set(row.id, completion)
      } catch (error) {
        if (error instanceof Error) {
          rowMap.set(row.id, error)
        } else {
          console.warn(
            'Error received in TaskCompletion DataLoader that is not an actual error:',
            error,
          )
          rowMap.set(row.id, new Error(String(error)))
        }
      }
    }

    return keys.map(key => rowMap.get(key) ?? null)
  })
}

export type TaskCompletionDataLoader = ReturnType<
  typeof taskCompletionDataLoader
>
