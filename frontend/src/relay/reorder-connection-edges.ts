import type { RecordProxy, RecordSourceSelectorProxy } from 'relay-runtime'

const edgesByNodeId = (edges: readonly RecordProxy[]) => {
  const byNode = new Map<string, RecordProxy>()
  for (const edge of edges) {
    const nodeId = edge.getLinkedRecord('node')?.getDataID()
    if (nodeId) byNode.set(nodeId, edge)
  }
  return byNode
}

const edgesInOrder = (
  edges: readonly RecordProxy[],
  orderedNodeIds: readonly string[],
) => {
  const byNode = edgesByNodeId(edges)
  const ordered: RecordProxy[] = []
  for (const nodeId of orderedNodeIds) {
    const edge = byNode.get(nodeId)
    if (!edge) return null
    ordered.push(edge)
  }
  return ordered.length === edges.length ? ordered : null
}

export const reorderConnectionEdges =
  (connectionId: string, orderedNodeIds: readonly string[]) =>
  (store: RecordSourceSelectorProxy) => {
    const connection = store.get(connectionId)
    const edges = connection?.getLinkedRecords('edges')
    if (!connection || !edges) return

    const ordered = edgesInOrder(edges, orderedNodeIds)
    if (!ordered) return

    connection.setLinkedRecords(ordered, 'edges')
  }
