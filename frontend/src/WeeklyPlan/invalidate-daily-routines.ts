import type { IEnvironment, RecordSourceSelectorProxy } from 'relay-runtime'

export const invalidateDailyRoutinesForDayOfWeek = (
  environment: IEnvironment,
  dayOfWeek: string,
) => {
  const recordIds = environment.getStore().getSource().getRecordIDs()
  return (store: RecordSourceSelectorProxy) => {
    for (const id of recordIds) {
      const record = store.get(id)
      if (
        record?.getType() === 'DailyRoutinePayload' &&
        record.getValue('dayOfWeek') === dayOfWeek
      ) {
        record.invalidateRecord()
      }
    }
  }
}
