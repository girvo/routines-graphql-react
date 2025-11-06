import { userRepo, type Context } from '../context/index.ts'
import * as UserDomain from '../domains/user.ts'
import DataLoader from 'dataloader'

export const userDataLoader = (context: Context) => {
  return new DataLoader(
    async (keys: readonly number[]) =>
      await context.userRepo
        .findAllByIds(keys)
        .then(rows => rows.map(UserDomain.tableToDomain)),
  )
}

export type UserDataLoader = ReturnType<typeof userDataLoader>
