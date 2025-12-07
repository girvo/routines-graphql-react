import { type Context, assertAuthenticated } from '../graphql/context.ts'
import { type RoutineSlotDomain, tableToDomain } from './routine-domain.ts'
import DataLoader from 'dataloader'

export const routineSlotDataLoader = (context: Context) => {
  assertAuthenticated(context)
  return new DataLoader(async (keys: readonly number[]) => {
    const rows = await context.routineRepo.findAllByIdsAndUserId(
      keys,
      context.currentUser.id,
    )
    const rowMap = new Map<number, RoutineSlotDomain | Error>()

    for (const row of rows) {
      try {
        const slot = tableToDomain(row)
        rowMap.set(row.id, slot)
      } catch (error) {
        if (error instanceof Error) {
          rowMap.set(row.id, error)
        } else {
          console.warn(
            'Error received in RoutineSlot DataLoader that is not an actual error:',
            error,
          )
          rowMap.set(row.id, new Error(String(error)))
        }
      }
    }

    return keys.map(key => rowMap.get(key) ?? null)
  })
}

export type RoutineSlotDataLoader = ReturnType<typeof routineSlotDataLoader>