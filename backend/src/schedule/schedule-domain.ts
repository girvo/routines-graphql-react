import type { DayOfWeek, DaySection } from '../database/types.ts'
import { isDayOfWeek, isDaySection } from '@my-routines/shared'
import type { RoutineSlotDomain } from '../routine-slot/routine-slot-domain.ts'
import type { TaskCompletionDomain } from '../task-completion/task-completion-domain.ts'
import { routineSlotToGraphQL } from '../routine-slot/routine-slot-domain.ts'
import { taskCompletionToGraphQL } from '../task-completion/task-completion-domain.ts'
import { routineSlotPositionCursor } from '../routine-slot/routine-slot-repository.ts'
import { parseISO } from 'date-fns'
import { getUserDayKey } from '../user-timezone.ts'
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
  const dayKey = getUserDayKey(date)
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

const DAY_SECTION_SLOTS_TYPENAME = 'DaySectionSlots'

export const encodeDaySectionSlotsId = (
  dayOfWeek: DayOfWeek,
  section: DaySection,
): GlobalId =>
  encodeGlobalId(DAY_SECTION_SLOTS_TYPENAME, `${dayOfWeek}:${section}`)

export const decodeDaySectionSlotsId = (
  globalId: GlobalId,
): { dayOfWeek: DayOfWeek; section: DaySection } => {
  const { type, payload } = decodeGlobalId(globalId)
  if (type !== DAY_SECTION_SLOTS_TYPENAME) {
    throw new Error(
      `Expected ${DAY_SECTION_SLOTS_TYPENAME} global ID, got ${type}`,
    )
  }

  const colonIndex = payload.indexOf(':')
  if (colonIndex < 1) {
    throw new Error(`Invalid ${DAY_SECTION_SLOTS_TYPENAME} payload: ${payload}`)
  }

  const dayOfWeek = payload.slice(0, colonIndex)
  const section = payload.slice(colonIndex + 1)

  if (!isDayOfWeek(dayOfWeek)) {
    throw new Error(
      `Invalid day of week in ${DAY_SECTION_SLOTS_TYPENAME} global ID: ${dayOfWeek}`,
    )
  }

  if (!isDaySection(section)) {
    throw new Error(
      `Invalid section in ${DAY_SECTION_SLOTS_TYPENAME} global ID: ${section}`,
    )
  }

  return { dayOfWeek, section }
}

export interface DaySectionSlotsData {
  __typename: 'DaySectionSlots'
  id: GlobalId
  dayOfWeek: DayOfWeek
  section: DaySection
}

export const daySectionSlotsToGraphQL = (
  dayOfWeek: DayOfWeek,
  section: DaySection,
): DaySectionSlotsData => ({
  __typename: DAY_SECTION_SLOTS_TYPENAME,
  id: encodeDaySectionSlotsId(dayOfWeek, section),
  dayOfWeek,
  section,
})

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
    cursor: routineSlotPositionCursor.encode({
      position: instance.routineSlot.position,
      id: instance.routineSlot.id,
    }),
  }
}
