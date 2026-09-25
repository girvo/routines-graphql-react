import type { Context } from './context.ts'
import type { UserDomain } from '../user/user-domain.ts'
import type { TaskDomain } from '../task/task-domain.ts'
import type { RoutineSlotDomain } from '../routine-slot/routine-slot-domain.ts'
import type { TaskCompletionDomain } from '../task-completion/task-completion-domain.ts'
import type { PushSubscriptionDomain } from '../push/push-domain.ts'
import type {
  DailyTaskInstanceData,
  DaySectionSlotsData,
} from '../schedule/schedule-domain.ts'
import type { GlobalId } from '../globalId.ts'

export interface NodeDomains {
  User: UserDomain
  Task: TaskDomain
  RoutineSlot: RoutineSlotDomain
  TaskCompletion: TaskCompletionDomain
  PushSubscription: PushSubscriptionDomain
  DailyTaskInstance: DailyTaskInstanceData
  DaySectionSlots: DaySectionSlotsData
}

export type NodeType = keyof NodeDomains

export type TypedNode<T extends NodeType> = NodeDomains[T] & { __typename: T }

export type NodeLoader<T extends NodeType, Key> = (
  key: Key,
  context: Context,
) => Promise<NodeDomains[T] | null>

export type NodeResolver<T extends NodeType> = (
  globalId: GlobalId,
  context: Context,
) => Promise<TypedNode<T> | null>

export interface PaginationArgs {
  first: number
  after?: string | null
  last?: number | null
  before?: string | null
}
