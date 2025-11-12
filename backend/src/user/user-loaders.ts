import type { Context } from '../graphql/context.ts'
import { type UserDomain, tableToDomain } from './user-domain.ts'
import DataLoader from 'dataloader'

export const userDataLoader = (context: Context) => {
  return new DataLoader(async (keys: readonly number[]) => {
    const rows = await context.userRepo.findAllByIds(keys)
    const rowMap = new Map<number, UserDomain | Error>()

    for (const row of rows) {
      try {
        rowMap.set(row.id, tableToDomain(row))
      } catch (error) {
        if (error instanceof Error) {
          rowMap.set(row.id, error)
        } else {
          console.warn(
            'Error received in User DataLoader that is not an actual error:',
            error,
          )
          rowMap.set(row.id, new Error(String(error)))
        }
      }
    }

    return keys.map(key => rowMap.get(key) ?? null)
  })
}

export type UserDataLoader = ReturnType<typeof userDataLoader>
