import { describe, expect, it } from 'vitest'
import {
  commitLocalUpdate,
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
  type GraphQLResponse,
  type RecordSourceSelectorProxy,
} from 'relay-runtime'
import { composeUpdaters } from './compose-updaters.ts'

const createEnvironment = () =>
  new Environment({
    network: Network.create(() =>
      Observable.create<GraphQLResponse>(() => () => {}),
    ),
    store: new Store(new RecordSource()),
  })

const recordMarker = (name: string, runs: string[] = []) => {
  const run = (store: RecordSourceSelectorProxy) => {
    runs.push(name)
    store.create(`seen:${name}`, 'DailyRoutinePayload')
  }
  return run
}

const hasRecord = (environment: Environment, dataID: string) =>
  !!environment.getStore().getSource().get(dataID)

const recordIDs = (environment: Environment) =>
  environment.getStore().getSource().getRecordIDs()

describe('composeUpdaters', () => {
  it('runs every updater once, in the order given, against one store', () => {
    const environment = createEnvironment()
    const runs: string[] = []

    commitLocalUpdate(
      environment,
      composeUpdaters(
        recordMarker('first', runs),
        recordMarker('second', runs),
      ),
    )

    expect(runs).toEqual(['first', 'second'])
    expect(hasRecord(environment, 'seen:first')).toBe(true)
    expect(hasRecord(environment, 'seen:second')).toBe(true)
  })

  it('skips the updaters a caller does not have', () => {
    const environment = createEnvironment()
    const runs: string[] = []

    commitLocalUpdate(
      environment,
      composeUpdaters(null, recordMarker('kept', runs), undefined),
    )

    expect(runs).toEqual(['kept'])
    expect(hasRecord(environment, 'seen:kept')).toBe(true)
  })

  it('writes nothing when the caller has no updaters at all', () => {
    const environment = createEnvironment()
    commitLocalUpdate(environment, recordMarker('seeded'))
    const before = recordIDs(environment)

    expect(() =>
      commitLocalUpdate(environment, composeUpdaters(null, undefined)),
    ).not.toThrow()

    expect(recordIDs(environment)).toEqual(before)
    expect(hasRecord(environment, 'seen:seeded')).toBe(true)
  })
})
