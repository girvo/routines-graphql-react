import type { Context } from './context.ts'
import type { UserNode } from '../user/user-domain.ts'
import type { TaskNode } from '../task/task-domain.ts'
import type { RoutineSlotNode } from '../routine-slot/routine-slot-domain.ts'
import type { TaskCompletionNode } from '../task-completion/task-completion-domain.ts'

export type NodeDomains =
  | UserNode
  | TaskNode
  | RoutineSlotNode
  | TaskCompletionNode

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
