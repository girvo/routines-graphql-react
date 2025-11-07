import { resolveUserAsNode } from './user.ts'
import type { Context } from '../context/index.ts'
import type { ResolversParentTypes } from '../resolvers/types.ts'

// Type nonsense to ensure our resolvers for Node are strongly typed
// via type extraction from the generated file

type NodeUnion = ResolversParentTypes['Node']
type NodeType = NonNullable<NodeUnion['__typename']>

type WithRequiredTypename<T> = T & {
  __typename: NonNullable<T extends { __typename?: infer U } ? U : never>
}

export type NodeResolver<T extends NodeType> = (
  id: number,
  context: Context,
) => Promise<WithRequiredTypename<
  Extract<NodeUnion, { __typename?: T }>
> | null>

export const nodeResolvers = {
  User: resolveUserAsNode,
}
