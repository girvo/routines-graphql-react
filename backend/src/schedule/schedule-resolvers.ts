import { assertAuthenticated, type Context } from '../graphql/context.ts'
import type {
  QueryResolvers,
  DailyRoutinePayloadResolvers,
  WeeklySchedulePayloadResolvers,
  DayScheduleResolvers,
} from '../graphql/resolver-types.ts'
import type { DayOfWeek, DaySection } from '../database/types.ts'
import { getDay } from 'date-fns'
import type { DailyRoutineData, DayScheduleData } from './schedule-domain.ts'
import {
  buildDailyTaskInstanceConnection,
  dailyTaskInstanceToGraphQL,
  type DailyTaskInstanceData,
} from './schedule-domain.ts'
import {
  tableToDomain as routineSlotTableToDomain,
  buildRoutineSlotConnection,
  routineSlotToGraphQL,
} from '../routine-slot/routine-slot-domain.ts'
import { tableToDomain as taskCompletionTableToDomain } from '../task-completion/task-completion-domain.ts'
import { GraphQLError } from 'graphql'

const isDayOfWeek = (day: string): day is DayOfWeek => {
  return [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ].includes(day as DayOfWeek)
}

const isDaySection = (section: string): section is DaySection => {
  return (['MORNING', 'MIDDAY', 'EVENING'] as const).includes(
    section as DaySection,
  )
}

const getDayOfWeek = (date: Date): DayOfWeek => {
  const dayIndex = getDay(date)
  const dayMap: DayOfWeek[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ]
  return dayMap[dayIndex]
}

export const dailyRoutine: QueryResolvers<Context>['dailyRoutine'] = async (
  _parent,
  { date },
  context,
) => {
  assertAuthenticated(context)

  const targetDate = date ?? new Date()
  const dayOfWeek = getDayOfWeek(targetDate)

  return {
    date: targetDate,
    dayOfWeek,
  }
}

/**
 * NOTE: This is eager, which is a bit rough. The reason for it is simple: this
 * is not a real Node with a real ID, but an ephemeral object that is a pair
 * of distinctly related data that will basically always be loaded together
 */
const createSectionResolver = <Section extends DaySection>(
  section: Section,
): DailyRoutinePayloadResolvers<Context>[Lowercase<Section>] => {
  return async (parent: DailyRoutineData, { first, after }, context) => {
    assertAuthenticated(context)

    const take = first ?? 10

    if (!isDayOfWeek(parent.dayOfWeek)) {
      throw new GraphQLError(`Invalid day of week ${parent.dayOfWeek}`)
    }

    if (!isDaySection(section)) {
      throw new GraphQLError(`Invalid section ${section}`)
    }

    const routineSlotRows =
      await context.routineRepo.findAllByDayAndSectionPaginated(
        context.currentUser.id,
        parent.dayOfWeek,
        section,
        { first: take, after },
      )

    const routineSlots = routineSlotRows.map(routineSlotTableToDomain)

    const completionRows =
      await context.taskCompletionRepo.findByRoutineSlotIdsAndDate(
        routineSlots.map(slot => slot.id),
        context.currentUser.id,
        parent.date,
      )

    const completions = completionRows.map(taskCompletionTableToDomain)
    const completionsBySlotId = new Map(
      completions.map(completion => [completion.routineSlotId, completion]),
    )

    const instances: DailyTaskInstanceData[] = routineSlots.map(slot => ({
      routineSlot: slot,
      completion: completionsBySlotId.get(slot.id) ?? null,
    }))

    const connection = buildDailyTaskInstanceConnection(instances, take)

    return {
      edges: connection.edges.map(edge => ({
        node: dailyTaskInstanceToGraphQL(edge.node),
        cursor: edge.cursor,
      })),
      pageInfo: connection.pageInfo,
    }
  }
}

export const morning = createSectionResolver('MORNING')
export const midday = createSectionResolver('MIDDAY')
export const evening = createSectionResolver('EVENING')

export const weeklySchedule: QueryResolvers<Context>['weeklySchedule'] = async (
  _parent,
  _args,
  context,
) => {
  assertAuthenticated(context)

  return {}
}

const createDayResolver = <Day extends DayOfWeek>(
  dayOfWeek: Day,
): WeeklySchedulePayloadResolvers<Context>[Lowercase<Day>] => {
  return async _parent => {
    return { dayOfWeek }
  }
}

export const monday = createDayResolver('MONDAY')
export const tuesday = createDayResolver('TUESDAY')
export const wednesday = createDayResolver('WEDNESDAY')
export const thursday = createDayResolver('THURSDAY')
export const friday = createDayResolver('FRIDAY')
export const saturday = createDayResolver('SATURDAY')
export const sunday = createDayResolver('SUNDAY')

const createDaySectionResolver = <Section extends DaySection>(
  section: Section,
): DayScheduleResolvers<Context>[Lowercase<Section>] => {
  return async (parent: DayScheduleData, { first, after }, context) => {
    assertAuthenticated(context)

    const take = first ?? 10

    if (!isDayOfWeek(parent.dayOfWeek)) {
      throw new GraphQLError(`Invalid day of week ${parent.dayOfWeek}`)
    }

    if (!isDaySection(section)) {
      throw new GraphQLError(`Invalid section ${section}`)
    }

    const routineSlotRows =
      await context.routineRepo.findAllByDayAndSectionPaginated(
        context.currentUser.id,
        parent.dayOfWeek,
        section,
        { first: take, after },
      )

    const connection = buildRoutineSlotConnection(routineSlotRows, take)

    return {
      edges: connection.edges.map(edge => ({
        node: routineSlotToGraphQL(edge.node),
        cursor: edge.cursor,
      })),
      pageInfo: connection.pageInfo,
    }
  }
}

export const dayMorning = createDaySectionResolver('MORNING')
export const dayMidday = createDaySectionResolver('MIDDAY')
export const dayEvening = createDaySectionResolver('EVENING')
