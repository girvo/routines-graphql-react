import { executeGraphQL, type YogaApp } from './graphql.ts'
import { graphql } from '../gql/gql.ts'
import { parse, type GraphQLError } from 'graphql'
import type { CreateRoutineSlotInput } from '../gql/graphql.ts'
import type { DayOfWeek, DaySection } from '../../src/database/types.ts'
import type { GlobalId } from '../../src/globalId.ts'

/**
 * Extracted this out as lots of other tests will need to run it
 */
const CreateRoutineSlotMutation = graphql(`
  mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {
    createRoutineSlot(input: $input) {
      routineSlotEdge {
        node {
          id
          task {
            id
            title
          }
          dayOfWeek
          section
          position
          createdAt
        }
        cursor
      }
    }
  }
`)

interface CreateRoutineSlotArgs {
  input: CreateRoutineSlotInput
  yoga: YogaApp
  userToken: string
}

export const createRoutineSlot = async ({
  input,
  yoga,
  userToken,
}: CreateRoutineSlotArgs) => {
  return await executeGraphQL(
    CreateRoutineSlotMutation,
    { input },
    {
      yoga,
      userToken,
    },
  )
}

const DeleteRoutineSlotMutation = graphql(`
  mutation DeleteRoutineSlotHelper($routineSlotId: ID!) {
    deleteRoutineSlot(routineSlotId: $routineSlotId) {
      deletedId
    }
  }
`)

interface DeleteRoutineSlotArgs {
  routineSlotId: GlobalId
  yoga: YogaApp
  userToken: string
}

export const deleteRoutineSlot = async ({
  routineSlotId,
  yoga,
  userToken,
}: DeleteRoutineSlotArgs) => {
  return await executeGraphQL(
    DeleteRoutineSlotMutation,
    { routineSlotId },
    { yoga, userToken },
  )
}

/**
 * Day and section are field names here, so these build their document at call
 * time instead of through `graphql()`.
 */
interface RawConnection {
  edges: { node: Record<string, unknown> }[]
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor?: string | null
    endCursor?: string | null
  }
}

export interface SectionSlotsPage {
  errors?: readonly GraphQLError[]
  ids: string[]
  positions: number[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

interface SectionPageArgs {
  yoga: YogaApp
  userToken: string
  first?: number
  after?: string
}

const CONNECTION_FIELDS = (nodeSelection: string) => `
  edges {
    node {
      ${nodeSelection}
    }
  }
  pageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`

const connectionPage = (
  connection: RawConnection | undefined,
  errors?: readonly GraphQLError[],
): SectionSlotsPage => ({
  errors,
  ids: (connection?.edges ?? []).map(edge => String(edge.node.id)),
  positions: (connection?.edges ?? []).map(edge => Number(edge.node.position)),
  hasNextPage: connection?.pageInfo.hasNextPage ?? false,
  hasPreviousPage: connection?.pageInfo.hasPreviousPage ?? false,
  startCursor: connection?.pageInfo.startCursor ?? null,
  endCursor: connection?.pageInfo.endCursor ?? null,
})

const SECTION_FIELD: Record<DaySection, string> = {
  MORNING: 'morning',
  MIDDAY: 'midday',
  EVENING: 'evening',
}

const WEEKLY_DAY_FIELD: Record<DayOfWeek, string> = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
}

interface WeeklySectionResponse {
  weeklySchedule: Record<string, Record<string, RawConnection>>
}

interface WeeklySectionVariables {
  first?: number
  after?: string
}

export const queryWeeklySectionSlots = async (
  args: SectionPageArgs & { dayOfWeek: DayOfWeek; section: DaySection },
): Promise<SectionSlotsPage> => {
  const dayField = WEEKLY_DAY_FIELD[args.dayOfWeek]
  const sectionField = SECTION_FIELD[args.section]

  const result = await executeGraphQL<
    WeeklySectionResponse,
    WeeklySectionVariables
  >(
    parse(`
      query WeeklySectionOrder($first: NonNegativeInt, $after: String) {
        weeklySchedule {
          ${dayField} {
            ${sectionField}(first: $first, after: $after) {
              ${CONNECTION_FIELDS('id position')}
            }
          }
        }
      }
    `),
    { first: args.first, after: args.after },
    { yoga: args.yoga, userToken: args.userToken },
  )

  return connectionPage(
    result.data?.weeklySchedule[dayField]?.[sectionField],
    result.errors,
  )
}

interface DailySectionResponse {
  dailyRoutine: Record<string, RawConnection>
}

interface DailySectionVariables {
  date: Date
  first?: number
  after?: string
}

export const queryDailySectionSlots = async (
  args: SectionPageArgs & { date: Date; section: DaySection },
): Promise<SectionSlotsPage & { instanceIds: string[] }> => {
  const sectionField = SECTION_FIELD[args.section]

  const result = await executeGraphQL<
    DailySectionResponse,
    DailySectionVariables
  >(
    parse(`
      query DailySectionOrder($date: DateTime!, $first: NonNegativeInt, $after: String) {
        dailyRoutine(date: $date) {
          ${sectionField}(first: $first, after: $after) {
            ${CONNECTION_FIELDS(`id routineSlot { id position }`)}
          }
        }
      }
    `),
    { date: args.date, first: args.first, after: args.after },
    { yoga: args.yoga, userToken: args.userToken },
  )

  const connection = result.data?.dailyRoutine[sectionField]
  const slotConnection: RawConnection | undefined = connection && {
    ...connection,
    edges: connection.edges.map(edge => ({
      node: edge.node.routineSlot as Record<string, unknown>,
    })),
  }

  return {
    ...connectionPage(slotConnection, result.errors),
    instanceIds: (connection?.edges ?? []).map(edge => String(edge.node.id)),
  }
}

const DaySectionSlotsQuery = graphql(`
  query DaySectionSlotsContainerPage(
    $dayOfWeek: DayOfWeek!
    $section: DaySection!
    $first: NonNegativeInt
    $after: String
  ) {
    daySectionSlots(dayOfWeek: $dayOfWeek, section: $section) {
      id
      dayOfWeek
      section
      slots(first: $first, after: $after) {
        edges {
          node {
            id
            position
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`)

export interface DaySectionSlotsPage extends SectionSlotsPage {
  containerId: string | null
  dayOfWeek: string | null
  section: string | null
}

export const queryDaySectionSlots = async (
  args: SectionPageArgs & { dayOfWeek: DayOfWeek; section: DaySection },
): Promise<DaySectionSlotsPage> => {
  const result = await executeGraphQL(
    DaySectionSlotsQuery,
    {
      dayOfWeek: args.dayOfWeek,
      section: args.section,
      first: args.first,
      after: args.after,
    },
    { yoga: args.yoga, userToken: args.userToken },
  )

  const container = result.data?.daySectionSlots

  return {
    ...connectionPage(container?.slots, result.errors),
    containerId: container?.id ?? null,
    dayOfWeek: container?.dayOfWeek ?? null,
    section: container?.section ?? null,
  }
}
