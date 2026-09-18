import { assertAuthenticated, type Context } from '../graphql/context.ts'
import type {
  QueryResolvers,
  DailyRoutinePayloadResolvers,
  WeeklySchedulePayloadResolvers,
  DayScheduleResolvers,
  DaySectionSlotsResolvers,
  PageInfo,
} from '../graphql/resolver-types.ts'
import type { DayOfWeek, DaySection } from '../database/types.ts'
import { isDayOfWeek, isDaySection } from '@my-routines/shared'
import type {
  DailyRoutineData,
  DayScheduleData,
  DaySectionSlotsData,
  DailyTaskInstanceNode,
} from './schedule-domain.ts'
import type { GlobalId } from '../globalId.ts'
import {
  buildDailyTaskInstanceEdge,
  dailyTaskInstanceToGraphQL,
  daySectionSlotsToGraphQL,
  decodeDaySectionSlotsId,
  decodeDailyTaskInstanceId,
  type DailyTaskInstanceData,
} from './schedule-domain.ts'
import {
  tableToDomain as routineSlotTableToDomain,
  buildPositionedRoutineSlotConnection,
  routineSlotToGraphQL,
  type PositionedRoutineSlotConnection,
  type RoutineSlotNode,
} from '../routine-slot/routine-slot-domain.ts'
import { tableToDomain as taskCompletionTableToDomain } from '../task-completion/task-completion-domain.ts'
import { getUserDayOfWeek } from '../user-timezone.ts'
import { GraphQLError } from 'graphql'

const DEFAULT_SECTION_PAGE_SIZE = 10

export const dailyRoutine: QueryResolvers<Context>['dailyRoutine'] = async (
  _parent,
  { date },
  context,
) => {
  assertAuthenticated(context)

  const targetDate = date ?? new Date()
  const dayOfWeek = getUserDayOfWeek(targetDate)

  return {
    date: targetDate,
    dayOfWeek,
  }
}

/**
 * The one implementation every day/section Task list reads through, so the
 * weekly plan, the Today view and the DaySectionSlots container can never
 * drift in ordering or cursors.
 */
const resolveSectionConnection = async (
  dayOfWeek: DayOfWeek,
  section: DaySection,
  args: { first?: number | null; after?: string | null },
  context: Context,
): Promise<PositionedRoutineSlotConnection> => {
  assertAuthenticated(context)

  const take = args.first ?? DEFAULT_SECTION_PAGE_SIZE

  if (!isDayOfWeek(dayOfWeek)) {
    throw new GraphQLError(`Invalid day of week ${dayOfWeek}`)
  }

  if (!isDaySection(section)) {
    throw new GraphQLError(`Invalid section ${section}`)
  }

  const routineSlotRows =
    await context.routineRepo.findAllByDayAndSectionPaginated(
      context.currentUser.id,
      dayOfWeek,
      section,
      { first: take, after: args.after },
    )

  return buildPositionedRoutineSlotConnection(routineSlotRows, take)
}

interface GraphQLRoutineSlotConnection {
  edges: { node: RoutineSlotNode; cursor: string }[]
  pageInfo: PageInfo
}

const sectionConnectionToGraphQL = (
  connection: PositionedRoutineSlotConnection,
): GraphQLRoutineSlotConnection => ({
  edges: connection.edges.map(edge => ({
    node: routineSlotToGraphQL(edge.node),
    cursor: edge.cursor,
  })),
  pageInfo: connection.pageInfo,
})

/**
 * NOTE: This is eager, which is a bit rough. The reason for it is simple: this
 * is not a real Node with a real ID, but an ephemeral object that is a pair
 * of distinctly related data that will basically always be loaded together
 */
const createSectionResolver = <Section extends DaySection>(
  section: Section,
): DailyRoutinePayloadResolvers<Context>[Lowercase<Section>] => {
  return async (parent: DailyRoutineData, args, context) => {
    assertAuthenticated(context)

    const connection = await resolveSectionConnection(
      parent.dayOfWeek,
      section,
      args,
      context,
    )

    const routineSlots = connection.edges.map(edge => edge.node)

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
      date: parent.date,
      routineSlot: slot,
      completion: completionsBySlotId.get(slot.id) ?? null,
    }))

    const instanceEdges = instances.map(buildDailyTaskInstanceEdge)

    return {
      edges: instanceEdges.map(edge => ({
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
  return async (parent: DayScheduleData, args, context) => {
    const connection = await resolveSectionConnection(
      parent.dayOfWeek,
      section,
      args,
      context,
    )

    return sectionConnectionToGraphQL(connection)
  }
}

export const dayMorning = createDaySectionResolver('MORNING')
export const dayMidday = createDaySectionResolver('MIDDAY')
export const dayEvening = createDaySectionResolver('EVENING')

export const daySectionSlots: QueryResolvers<Context>['daySectionSlots'] =
  async (_parent, { dayOfWeek, section }, context) => {
    assertAuthenticated(context)

    return daySectionSlotsToGraphQL(dayOfWeek, section)
  }

export const sectionSlots: DaySectionSlotsResolvers<Context>['slots'] = async (
  parent: DaySectionSlotsData,
  args,
  context,
) => {
  const connection = await resolveSectionConnection(
    parent.dayOfWeek,
    parent.section,
    args,
    context,
  )

  return sectionConnectionToGraphQL(connection)
}

export const resolveDaySectionSlotsAsNode = async (
  globalId: GlobalId,
  context: Context,
): Promise<DaySectionSlotsData | null> => {
  assertAuthenticated(context)

  try {
    const decoded = decodeDaySectionSlotsId(globalId)
    return daySectionSlotsToGraphQL(decoded.dayOfWeek, decoded.section)
  } catch {
    return null
  }
}

export const resolveDailyTaskInstanceAsNode = async (
  globalId: GlobalId,
  context: Context,
): Promise<DailyTaskInstanceNode | null> => {
  assertAuthenticated(context)

  let decoded: { date: Date; routineSlotId: number }
  try {
    decoded = decodeDailyTaskInstanceId(globalId)
  } catch {
    return null
  }

  const slotRow = await context.routineRepo.findByIdAndUserId(
    decoded.routineSlotId,
    context.currentUser.id,
  )
  if (!slotRow) {
    return null
  }

  const completionRows =
    await context.taskCompletionRepo.findByRoutineSlotIdsAndDate(
      [decoded.routineSlotId],
      context.currentUser.id,
      decoded.date,
    )

  const instance: DailyTaskInstanceData = {
    date: decoded.date,
    routineSlot: routineSlotTableToDomain(slotRow),
    completion: completionRows[0]
      ? taskCompletionTableToDomain(completionRows[0])
      : null,
  }

  return dailyTaskInstanceToGraphQL(instance)
}
