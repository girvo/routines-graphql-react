import { describe, expect, it } from 'vitest'
import {
  commitLocalUpdate,
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
  type GraphQLResponse,
} from 'relay-runtime'
import { invalidateDailyRoutinesForDayOfWeek } from '../invalidate-daily-routines.ts'

const MONDAY_PAYLOAD_ID = 'daily-routine-monday'
const TUESDAY_PAYLOAD_ID = 'daily-routine-tuesday'
const TASK_ID = 'task-pushups'

const createEnvironmentWithReads = () => {
  const environment = new Environment({
    network: Network.create(() =>
      Observable.create<GraphQLResponse>(() => () => {}),
    ),
    store: new Store(new RecordSource()),
  })

  commitLocalUpdate(environment, store => {
    store
      .create(MONDAY_PAYLOAD_ID, 'DailyRoutinePayload')
      .setValue('MONDAY', 'dayOfWeek')
    store
      .create(TUESDAY_PAYLOAD_ID, 'DailyRoutinePayload')
      .setValue('TUESDAY', 'dayOfWeek')
    store.create(TASK_ID, 'Task').setValue('MONDAY', 'dayOfWeek')
  })

  return environment
}

const invalidationStateOf = (environment: Environment, dataIDs: string[]) =>
  environment.getStore().lookupInvalidationState(dataIDs)

describe('invalidateDailyRoutinesForDayOfWeek', () => {
  it('invalidates the payload of the day the slot moved in', () => {
    const environment = createEnvironmentWithReads()
    const before = invalidationStateOf(environment, [MONDAY_PAYLOAD_ID])

    commitLocalUpdate(
      environment,
      invalidateDailyRoutinesForDayOfWeek(environment, 'MONDAY'),
    )

    expect(environment.getStore().checkInvalidationState(before)).toBe(true)
  })

  it('leaves another day of the week fresh', () => {
    const environment = createEnvironmentWithReads()
    const before = invalidationStateOf(environment, [TUESDAY_PAYLOAD_ID])

    commitLocalUpdate(
      environment,
      invalidateDailyRoutinesForDayOfWeek(environment, 'MONDAY'),
    )

    expect(environment.getStore().checkInvalidationState(before)).toBe(false)
  })

  it('leaves a record that is not a DailyRoutinePayload alone', () => {
    const environment = createEnvironmentWithReads()
    const before = invalidationStateOf(environment, [TASK_ID])

    commitLocalUpdate(
      environment,
      invalidateDailyRoutinesForDayOfWeek(environment, 'MONDAY'),
    )

    expect(environment.getStore().checkInvalidationState(before)).toBe(false)
  })

  it('invalidates nothing when that day was never read', () => {
    const environment = createEnvironmentWithReads()
    const before = invalidationStateOf(environment, [MONDAY_PAYLOAD_ID])

    commitLocalUpdate(
      environment,
      invalidateDailyRoutinesForDayOfWeek(environment, 'SUNDAY'),
    )

    expect(environment.getStore().checkInvalidationState(before)).toBe(false)
  })
})
