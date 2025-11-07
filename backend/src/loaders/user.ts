import { userRepo, type Context } from '../context/index.ts'
import * as UserDomain from '../domains/user.ts'
import DataLoader from 'dataloader'

export const userDataLoader = (context: Context) => {
  return new DataLoader(async (keys: readonly number[]) => {
    const rows = await context.userRepo.findAllByIds(keys)
    const rowMap = new Map<number, UserDomain.UserDomain | Error>()

    for (const row of rows) {
      try {
        rowMap.set(row.id, UserDomain.tableToDomain(row))
      } catch (error) {
        rowMap.set(row.id, error instanceof Error ? error : new Error(String(error)))
      }
    }

    return keys.map(key => rowMap.get(key) ?? null)
  })
}

export type UserDataLoader = ReturnType<typeof userDataLoader>
