import { describe, expect, it } from 'vitest'
import {
  commitLocalUpdate,
  ConnectionHandler,
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
  type GraphQLResponse,
  type RecordSourceSelectorProxy,
} from 'relay-runtime'
import { applyMove } from '../../WeeklyPlan/task-order.ts'
import { reorderConnectionEdges } from '../reorder-connection-edges.ts'

const CONTAINER_ID = 'day-section-slots-monday-morning'
const CONNECTION_ID = ConnectionHandler.getConnectionID(
  CONTAINER_ID,
  'DaySection_slots',
)
const OTHER_CONNECTION_ID = ConnectionHandler.getConnectionID(
  'other-container',
  'DaySection_slots',
)

const edgeFor = (store: RecordSourceSelectorProxy, nodeId: string) => {
  const node = store.get(nodeId) ?? store.create(nodeId, 'RoutineSlot')
  const edge =
    store.get(`edge:${nodeId}`) ??
    store.create(`edge:${nodeId}`, 'RoutineSlotEdge')
  edge.setLinkedRecord(node, 'node')
  return edge
}

const createSection = (nodeIds: string[]) => {
  const environment = new Environment({
    network: Network.create(() =>
      Observable.create<GraphQLResponse>(() => () => {}),
    ),
    store: new Store(new RecordSource()),
  })

  commitLocalUpdate(environment, store => {
    const connection = store.create(CONNECTION_ID, 'RoutineSlotConnection')
    if (nodeIds.length > 0)
      connection.setLinkedRecords(
        nodeIds.map(nodeId => edgeFor(store, nodeId)),
        'edges',
      )
  })

  return environment
}

const writeServerOrder = (environment: Environment, nodeIds: string[]) => {
  commitLocalUpdate(environment, store => {
    store.get(CONNECTION_ID)?.setLinkedRecords(
      nodeIds.map(nodeId => edgeFor(store, nodeId)),
      'edges',
    )
  })
}

const visibleOrder = (environment: Environment) => {
  let order: string[] = []
  commitLocalUpdate(environment, store => {
    order = (store.get(CONNECTION_ID)?.getLinkedRecords('edges') ?? [])
      .map(edge => edge.getLinkedRecord('node')?.getDataID())
      .filter((nodeId): nodeId is string => !!nodeId)
  })
  return order
}

describe('reorderConnectionEdges', () => {
  it('reorders the edges the connection already holds', () => {
    const environment = createSection(['slot-a', 'slot-b', 'slot-c'])

    commitLocalUpdate(
      environment,
      reorderConnectionEdges(CONNECTION_ID, ['slot-c', 'slot-a', 'slot-b']),
    )

    expect(visibleOrder(environment)).toEqual(['slot-c', 'slot-a', 'slot-b'])
  })

  it('writes the order applyMove produces for a relative target', () => {
    const environment = createSection(['slot-a', 'slot-b', 'slot-c'])
    const slotIds = ['slot-a', 'slot-b', 'slot-c']

    commitLocalUpdate(
      environment,
      reorderConnectionEdges(
        CONNECTION_ID,
        applyMove(slotIds, 'slot-a', { afterRoutineSlotId: 'slot-c' }),
      ),
    )

    expect(visibleOrder(environment)).toEqual(['slot-b', 'slot-c', 'slot-a'])
  })

  it('reorders again when reapplied over a restored order', () => {
    const environment = createSection(['slot-a', 'slot-b', 'slot-c'])
    const moveSlotAToBottom = reorderConnectionEdges(CONNECTION_ID, [
      'slot-b',
      'slot-c',
      'slot-a',
    ])

    commitLocalUpdate(environment, moveSlotAToBottom)
    writeServerOrder(environment, ['slot-a', 'slot-b', 'slot-c'])
    commitLocalUpdate(environment, moveSlotAToBottom)

    expect(visibleOrder(environment)).toEqual(['slot-b', 'slot-c', 'slot-a'])
  })

  it('leaves the list alone when the connection record is missing', () => {
    const environment = createSection(['slot-a', 'slot-b', 'slot-c'])

    expect(() =>
      commitLocalUpdate(
        environment,
        reorderConnectionEdges(OTHER_CONNECTION_ID, [
          'slot-c',
          'slot-b',
          'slot-a',
        ]),
      ),
    ).not.toThrow()

    expect(visibleOrder(environment)).toEqual(['slot-a', 'slot-b', 'slot-c'])
  })

  it('leaves the list alone when an ordered id is not in the connection', () => {
    const environment = createSection(['slot-a', 'slot-b', 'slot-c'])

    commitLocalUpdate(
      environment,
      reorderConnectionEdges(CONNECTION_ID, [
        'slot-c',
        'slot-a',
        'slot-removed',
      ]),
    )

    expect(visibleOrder(environment)).toEqual(['slot-a', 'slot-b', 'slot-c'])
  })

  it('keeps an edge the caller never saw instead of dropping it', () => {
    const environment = createSection(['slot-a', 'slot-b', 'slot-c'])

    commitLocalUpdate(
      environment,
      reorderConnectionEdges(CONNECTION_ID, ['slot-c', 'slot-a']),
    )

    expect(visibleOrder(environment)).toEqual(['slot-a', 'slot-b', 'slot-c'])
  })

  it('keeps an edge with no node instead of dropping it', () => {
    const environment = createSection(['slot-a', 'slot-b'])

    commitLocalUpdate(environment, store => {
      const connection = store.get(CONNECTION_ID)
      const held = connection?.getLinkedRecords('edges') ?? []
      connection?.setLinkedRecords(
        [...held, store.create('edge:nodeless', 'RoutineSlotEdge')],
        'edges',
      )
    })

    commitLocalUpdate(
      environment,
      reorderConnectionEdges(CONNECTION_ID, ['slot-b', 'slot-a']),
    )

    expect(visibleOrder(environment)).toEqual(['slot-a', 'slot-b'])
  })

  it('leaves a connection with no edges written alone', () => {
    const environment = createSection([])

    expect(() =>
      commitLocalUpdate(
        environment,
        reorderConnectionEdges(CONNECTION_ID, ['slot-c', 'slot-a', 'slot-b']),
      ),
    ).not.toThrow()

    expect(visibleOrder(environment)).toEqual([])
  })
})
