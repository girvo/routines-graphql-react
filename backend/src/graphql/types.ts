// import type { ResolversParentTypes } from './resolver-types.ts'

// Type nonsense to ensure our resolvers for Node are strongly typed
// via type extraction from the generated file

// type NodeUnion = ResolversParentTypes['Node']
// export type NodeType = NonNullable<NodeUnion['__typename']>

// type WithRequiredTypename<T> = T & {
//   __typename: NonNullable<T extends { __typename?: infer U } ? U : never>
// }

// export type NodeResolver<T extends NodeType> = (
//   id: number,
//   context: Context,
// ) => Promise<WithRequiredTypename<
//   Extract<NodeUnion, { __typename?: T }>
// > | null>

import type { Context } from './context.ts'
import type { UserNode } from '../user/user-domain.ts'
import type { TaskNode } from '../task/task-domain.ts'

export type NodeDomains = UserNode | TaskNode

// Extract the typename literals
export type NodeType = NodeDomains['__typename']

// Resolver type: given a typename, return the corresponding model
export type NodeResolver<T extends NodeType> = (
  id: number,
  context: Context,
) => Promise<Extract<NodeDomains, { __typename: T }> | null>

export interface PaginationArgs {
  first: number
  after?: string | null
  last?: number | null
  before?: string | null
}
