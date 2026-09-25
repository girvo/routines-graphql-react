import type { MockResolver } from 'relay-test-utils'

type MockResolverPath = Parameters<MockResolver>[0]['path']

export const edgeIndexOf = (path: MockResolverPath): number | null => {
  const edgesAt = path?.lastIndexOf('edges') ?? -1
  if (!path || edgesAt === -1 || edgesAt + 1 >= path.length) return null
  return Number(path[edgesAt + 1])
}
