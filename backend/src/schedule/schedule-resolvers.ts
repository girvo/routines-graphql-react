import { assertAuthenticated, type Context } from '../graphql/context.ts'
import type {
  QueryResolvers,
  DailyRoutinePayloadResolvers,
  DayOfWeek as DayOfWeekGql,
} from '../graphql/resolver-types.ts'
import type { DayOfWeek, DaySection } from '../database/types.ts'
import { getDay } from 'date-fns'
import type { DailyRoutineData } from './schedule-domain.ts'
import {
  buildDailyTaskInstanceConnection,
  dailyTaskInstanceToGraphQL,
  type DailyTaskInstanceData,
} from './schedule-domain.ts'
import { tableToDomain as routineSlotTableToDomain } from '../routine-slot/routine-slot-domain.ts'
import { tableToDomain as taskCompletionTableToDomain } from '../task-completion/task-completion-domain.ts'
import { GraphQLError } from 'graphql'

const VALID_DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

const VALID_SECTIONS = ['MORNING', 'MIDDAY', 'EVENING'] as const

const isDayOfWeek = (day: string): day is DayOfWeek => {
  return VALID_DAYS.includes(day as DayOfWeek)
}

const isDaySection = (section: string): section is DaySection => {
  return VALID_SECTIONS.includes(section as DaySection)
}

const toDayOfWeek = (day: DayOfWeekGql): DayOfWeek => {
  if (!isDayOfWeek(day)) {
    throw new Error(`Invalid day of week: ${day}`)
  }
  return day
}

const toDaySection = (section: string): DaySection => {
  if (!isDaySection(section)) {
    throw new Error(`Invalid day section: ${section}`)
  }
  return section
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

const createSectionResolver = (
  section: 'MORNING' | 'MIDDAY' | 'EVENING',
): DailyRoutinePayloadResolvers<Context>['morning'] => {
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
