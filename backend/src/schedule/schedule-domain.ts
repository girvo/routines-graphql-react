import type { DayOfWeek, PageInfo } from '../graphql/resolver-types.ts'
import type { RoutineSlotDomain } from '../routine-slot/routine-slot-domain.ts'
import type { TaskCompletionDomain } from '../task-completion/task-completion-domain.ts'
import { routineSlotToGraphQL } from '../routine-slot/routine-slot-domain.ts'
import { taskCompletionToGraphQL } from '../task-completion/task-completion-domain.ts'
import { routineSlotCursor } from '../routine-slot/routine-slot-repository.ts'

export interface DailyRoutineData {
  date: Date
  dayOfWeek: DayOfWeek
}

export interface DailyTaskInstanceData {
  routineSlot: RoutineSlotDomain
  completion: TaskCompletionDomain | null
}

export const dailyTaskInstanceToGraphQL = (instance: DailyTaskInstanceData) => ({
  __typename: 'DailyTaskInstance' as const,
  routineSlot: routineSlotToGraphQL(instance.routineSlot),
  completion: instance.completion ? taskCompletionToGraphQL(instance.completion) : null,
})

export const buildDailyTaskInstanceEdge = (instance: DailyTaskInstanceData) => {
  return {
    node: instance,
    cursor: routineSlotCursor.encode({
      createdAt: instance.routineSlot.createdAt.toISOString(),
      id: instance.routineSlot.id,
    }),
  }
}

export interface DailyTaskInstanceConnection {
  edges: ReturnType<typeof buildDailyTaskInstanceEdge>[]
  pageInfo: PageInfo
}

export const buildDailyTaskInstanceConnection = (
  instances: DailyTaskInstanceData[],
  requestedCount: number,
): DailyTaskInstanceConnection => {
  const hasNextPage = instances.length > requestedCount
  const edges = instances
    .slice(0, requestedCount)
    .map(buildDailyTaskInstanceEdge)

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: false,
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
    },
  }
}
