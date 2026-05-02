import type { DayOfWeek, PageInfo } from '../graphql/resolver-types.ts'
import type { RoutineSlotDomain } from '../routine-slot/routine-slot-domain.ts'
import type { TaskCompletionDomain } from '../task-completion/task-completion-domain.ts'
import { routineSlotToGraphQL } from '../routine-slot/routine-slot-domain.ts'
import { taskCompletionToGraphQL } from '../task-completion/task-completion-domain.ts'
import { routineSlotCursor } from '../routine-slot/routine-slot-repository.ts'
import { format, parseISO } from 'date-fns'
import {
  encodeGlobalId,
  decodeGlobalId,
  type GlobalId,
} from '../globalId.ts'

export interface DailyRoutineData {
  date: Date
  dayOfWeek: DayOfWeek
}

export interface WeeklyScheduleData {}

export interface DayScheduleData {
  dayOfWeek: DayOfWeek
}

export interface DailyTaskInstanceData {
  date: Date
  routineSlot: RoutineSlotDomain
  completion: TaskCompletionDomain | null
}

const DAILY_TASK_INSTANCE_TYPENAME = 'DailyTaskInstance'

export const encodeDailyTaskInstanceId = (
  routineSlotId: number,
  date: Date,
): GlobalId => {
  const dayKey = format(date, 'yyyy-MM-dd')
  return encodeGlobalId(
    DAILY_TASK_INSTANCE_TYPENAME,
    `${dayKey}:${routineSlotId}`,
  )
}

export const decodeDailyTaskInstanceId = (
  globalId: GlobalId,
): { date: Date; routineSlotId: number } => {
  const { type, payload } = decodeGlobalId(globalId)
  if (type !== DAILY_TASK_INSTANCE_TYPENAME) {
    throw new Error(
      `Expected ${DAILY_TASK_INSTANCE_TYPENAME} global ID, got ${type}`,
    )
  }

  const colonIndex = payload.indexOf(':')
  if (colonIndex < 1) {
    throw new Error(`Invalid DailyTaskInstance payload: ${payload}`)
  }

  const dayKey = payload.slice(0, colonIndex)
  const slotIdStr = payload.slice(colonIndex + 1)

  const routineSlotId = parseInt(slotIdStr, 10)
  if (isNaN(routineSlotId)) {
    throw new Error(
      `Invalid routine slot ID in DailyTaskInstance global ID: ${slotIdStr}`,
    )
  }

  const date = parseISO(dayKey)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date in DailyTaskInstance global ID: ${dayKey}`)
  }

  return { date, routineSlotId }
}

export const dailyTaskInstanceToGraphQL = (
  instance: DailyTaskInstanceData,
) => ({
  __typename: 'DailyTaskInstance' as const,
  id: encodeDailyTaskInstanceId(instance.routineSlot.id, instance.date),
  routineSlot: routineSlotToGraphQL(instance.routineSlot),
  completion: instance.completion
    ? taskCompletionToGraphQL(instance.completion)
    : null,
})

export type DailyTaskInstanceNode = ReturnType<typeof dailyTaskInstanceToGraphQL>

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
