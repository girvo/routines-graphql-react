import { assert, describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTask } from '../helpers/tasks.ts'
import {
  createTestApp,
  executeGraphQL,
  type YogaApp,
} from '../helpers/graphql.ts'
import {
  createRoutineSlot,
  deleteRoutineSlot,
  moveRoutineSlot,
  queryDaySectionSlots,
  queryDailySectionSlots,
} from '../helpers/routine-slot.ts'
import { graphql } from '../gql/gql.ts'
import { parse } from 'graphql'
import { db } from '../../src/database/index.ts'
import {
  asGlobalId,
  encodeGlobalId,
  fromGlobalId,
  toGlobalId,
} from '../../src/globalId.ts'
import { encodeDaySectionSlotsId } from '../../src/schedule/schedule-domain.ts'
import { decodeBaseCursor } from '../../src/graphql/cursor.ts'
import type { DayOfWeek, DaySection } from '../../src/database/types.ts'
import type { GlobalId } from '../../src/globalId.ts'
import type {
  MoveRoutineSlotInput,
  SlotMoveDestination,
} from '../gql/graphql.ts'

let yoga: YogaApp

beforeAll(async () => {
  const { yoga: testYoga } = await createTestApp()
  yoga = testYoga
})

beforeEach(async () => {
  await clearAllTables()
})

const createSlot = async (options: {
  title?: string
  taskId?: GlobalId
  dayOfWeek: DayOfWeek
  section: DaySection
  userToken: string
}) => {
  let taskId = options.taskId
  if (!taskId) {
    const task = await createTask({
      title: options.title ?? 'Untitled task',
      yoga,
      userToken: options.userToken,
    })
    taskId = task.data?.createTask?.taskEdge.node.id
    assert(taskId !== undefined, 'task created')
  }

  const slot = await createRoutineSlot({
    input: {
      taskId,
      dayOfWeek: options.dayOfWeek,
      section: options.section,
    },
    yoga,
    userToken: options.userToken,
  })
  expect(slot.errors).toBeUndefined()

  const node = slot.data?.createRoutineSlot?.routineSlotEdge.node
  assert(node !== undefined, 'slot created')
  return node
}

type CreatedSlot = Awaited<ReturnType<typeof createSlot>>

const DaySectionSlotsNodeQuery = graphql(`
  query DaySectionSlotsNode($id: ID!) {
    node(id: $id) {
      __typename
      ... on DaySectionSlots {
        id
        dayOfWeek
        section
        slots {
          edges {
            node {
              id
              position
            }
          }
        }
      }
    }
  }
`)

const createSlots = async (
  count: number,
  target: { dayOfWeek: DayOfWeek; section: DaySection; userToken: string },
) => {
  const slots: CreatedSlot[] = []
  for (let index = 0; index < count; index += 1) {
    slots.push(
      await createSlot({
        title: `Task ${index}`,
        dayOfWeek: target.dayOfWeek,
        section: target.section,
        userToken: target.userToken,
      }),
    )
  }
  return slots
}

const dayAndSectionRows = (target: {
  userId: number
  dayOfWeek: DayOfWeek
  section: DaySection
}) =>
  db
    .selectFrom('routine_slots')
    .selectAll()
    .where('user_id', '=', target.userId)
    .where('day_of_week', '=', target.dayOfWeek)
    .where('section', '=', target.section)
    .orderBy('position', 'asc')
    .orderBy('id', 'asc')
    .execute()

describe('Section ordering reads', () => {
  it('returns freshly created slots dense from 0 in creation order', async () => {
    const { userToken } = await createTestUser()

    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    expect(slots.map(slot => slot.position)).toEqual([0, 1, 2])

    const page = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(page.errors).toBeUndefined()
    expect(page.ids).toEqual(slots.map(slot => slot.id))
    expect(page.positions).toEqual([0, 1, 2])
    assert(
      page.startCursor !== null && page.endCursor !== null,
      'section has cursors',
    )
    expect(decodeBaseCursor(page.startCursor)).toEqual({
      position: 0,
      id: fromGlobalId(asGlobalId(slots[0].id), 'RoutineSlot'),
    })
    expect(decodeBaseCursor(page.endCursor)).toEqual({
      position: 2,
      id: fromGlobalId(asGlobalId(slots[2].id), 'RoutineSlot'),
    })
    expect(page.hasNextPage).toBe(false)
  })

  it('numbers each day and section from 0 independently', async () => {
    const { userToken } = await createTestUser()

    const mondayMorning = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const mondayMidday = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MIDDAY',
      userToken,
    })
    const tuesdayMorning = await createSlots(2, {
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
      userToken,
    })

    expect(mondayMorning.map(slot => slot.position)).toEqual([0, 1])
    expect(mondayMidday.map(slot => slot.position)).toEqual([0, 1])
    expect(tuesdayMorning.map(slot => slot.position)).toEqual([0, 1])

    for (const target of [
      { dayOfWeek: 'MONDAY', section: 'MORNING' },
      { dayOfWeek: 'MONDAY', section: 'MIDDAY' },
      { dayOfWeek: 'TUESDAY', section: 'MORNING' },
    ] as const) {
      const page = await queryDaySectionSlots({
        yoga,
        userToken,
        dayOfWeek: target.dayOfWeek,
        section: target.section,
      })
      expect(page.errors).toBeUndefined()
      expect(page.ids.length).toBe(2)
      expect(page.positions).toEqual([0, 1])
    }
  })

  it('paginates a section with position cursors and no gaps or duplicates', async () => {
    const { userToken } = await createTestUser()

    const slots = await createSlots(5, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const firstPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      first: 2,
    })
    expect(firstPage.errors).toBeUndefined()
    expect(firstPage.ids).toEqual([slots[0].id, slots[1].id])
    expect(firstPage.hasNextPage).toBe(true)
    assert(firstPage.endCursor !== null, 'first page has an end cursor')

    const secondPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      first: 2,
      after: firstPage.endCursor,
    })
    expect(secondPage.errors).toBeUndefined()
    expect(secondPage.ids).toEqual([slots[2].id, slots[3].id])
    expect(secondPage.positions).toEqual([2, 3])
    expect(secondPage.hasNextPage).toBe(true)
    assert(secondPage.endCursor !== null, 'second page has an end cursor')

    const thirdPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      first: 2,
      after: secondPage.endCursor,
    })
    expect(thirdPage.errors).toBeUndefined()
    expect(thirdPage.ids).toEqual([slots[4].id])
    expect(thirdPage.positions).toEqual([4])
    expect(thirdPage.hasNextPage).toBe(false)

    const visited = [...firstPage.ids, ...secondPage.ids, ...thirdPage.ids]
    expect(new Set(visited).size).toBe(5)
    expect(visited).toEqual(slots.map(slot => slot.id))
  })

  it('mirrors the container order in dailyRoutine with position cursors', async () => {
    const { userToken } = await createTestUser()

    const monday = new Date('2025-12-08T12:00:00Z')
    const dayOfWeekResult = await executeGraphQL(
      graphql(`
        query OrderingDayOfWeek($date: DateTime) {
          dailyRoutine(date: $date) {
            dayOfWeek
          }
        }
      `),
      { date: monday },
      { yoga, userToken },
    )
    const dayOfWeek = dayOfWeekResult.data?.dailyRoutine.dayOfWeek
    assert(dayOfWeek !== undefined, 'day of week resolved')
    expect(dayOfWeek).toBe('MONDAY')

    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const container = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    const daily = await queryDailySectionSlots({
      yoga,
      userToken,
      date: monday,
      section: 'MORNING',
    })

    expect(daily.errors).toBeUndefined()
    expect(daily.ids).toEqual(container.ids)
    expect(daily.ids).toEqual(slots.map(slot => slot.id))
    expect(daily.positions).toEqual([0, 1, 2])

    assert(
      daily.startCursor !== null && daily.endCursor !== null,
      'daily section has cursors',
    )
    expect(decodeBaseCursor(daily.startCursor)).toEqual({
      position: 0,
      id: fromGlobalId(asGlobalId(slots[0].id), 'RoutineSlot'),
    })
    expect(decodeBaseCursor(daily.endCursor)).toEqual({
      position: 2,
      id: fromGlobalId(asGlobalId(slots[2].id), 'RoutineSlot'),
    })

    expect(new Set(daily.instanceIds).size).toBe(3)
  })

  it('reorders every read path after a slot is moved to the top', async () => {
    const { userToken } = await createTestUser()

    const mondayMorning = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const mondayMidday = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MIDDAY',
      userToken,
    })
    const tuesdayMorning = await createSlots(2, {
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
      userToken,
    })

    const shuffled = [mondayMorning[2], mondayMorning[0], mondayMorning[1]]
    const moved = await moveRoutineSlot({
      yoga,
      userToken,
      input: { routineSlotId: mondayMorning[2].id, to: 'TOP' },
    })
    expect(moved.errors).toBeUndefined()

    const container = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(container.errors).toBeUndefined()
    expect(container.ids).toEqual(shuffled.map(slot => slot.id))
    expect(container.positions).toEqual([0, 1, 2])

    const daily = await queryDailySectionSlots({
      yoga,
      userToken,
      date: new Date('2025-12-08T12:00:00Z'),
      section: 'MORNING',
    })
    expect(daily.errors).toBeUndefined()
    expect(daily.ids).toEqual(shuffled.map(slot => slot.id))
    assert(
      daily.startCursor !== null && daily.endCursor !== null,
      'daily section has cursors',
    )
    expect(decodeBaseCursor(daily.startCursor)).toEqual({
      position: 0,
      id: fromGlobalId(asGlobalId(shuffled[0].id), 'RoutineSlot'),
    })
    expect(decodeBaseCursor(daily.endCursor)).toEqual({
      position: 2,
      id: fromGlobalId(asGlobalId(shuffled[2].id), 'RoutineSlot'),
    })

    assert(
      container.startCursor !== null && container.endCursor !== null,
      'container section has cursors',
    )

    const middayPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MIDDAY',
    })
    const tuesdayPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
    })
    expect(middayPage.ids).toEqual(mondayMidday.map(slot => slot.id))
    expect(middayPage.positions).toEqual([0, 1])
    expect(tuesdayPage.ids).toEqual(tuesdayMorning.map(slot => slot.id))
    expect(tuesdayPage.positions).toEqual([0, 1])
  })

  it('keeps Task.slots in created_at order rather than position order', async () => {
    const { userToken } = await createTestUser()

    const task = await createTask({ title: 'Shared task', yoga, userToken })
    const taskId = task.data!.createTask!.taskEdge.node.id
    const otherTask = await createTask({ title: 'Other task', yoga, userToken })
    const otherTaskId = otherTask.data!.createTask!.taskEdge.node.id

    const morningSlot = await createSlot({
      taskId,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const eveningSlot = await createSlot({
      taskId,
      dayOfWeek: 'MONDAY',
      section: 'EVENING',
      userToken,
    })
    // Fills MONDAY/MORNING position 0 so the revived slot cannot get it back.
    const otherSlot = await createSlot({
      taskId: otherTaskId,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    await deleteRoutineSlot({
      routineSlotId: morningSlot.id,
      yoga,
      userToken,
    })
    const revived = await createSlot({
      taskId,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    expect(revived.id).toBe(morningSlot.id)

    const morningSection = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(morningSection.ids).toEqual([otherSlot.id, morningSlot.id])
    expect(morningSection.positions).toEqual([0, 1])

    const taskSlots = await executeGraphQL(
      graphql(`
        query TaskSlotsOrderAfterRevive {
          tasks {
            edges {
              node {
                title
                slots {
                  edges {
                    node {
                      id
                      position
                      section
                    }
                  }
                }
              }
            }
          }
        }
      `),
      {},
      { yoga, userToken },
    )
    expect(taskSlots.errors).toBeUndefined()

    const sharedTask = taskSlots.data?.tasks?.edges
      .map(edge => edge.node)
      .find(node => node.title === 'Shared task')
    assert(sharedTask !== undefined, 'shared task returned')

    expect(sharedTask.slots.edges.map(edge => edge.node.id)).toEqual([
      morningSlot.id,
      eveningSlot.id,
    ])
    expect(sharedTask.slots.edges.map(edge => edge.node.position)).toEqual([
      1, 0,
    ])
  })
})

describe('Deleting renumbers the rest of the day and section', () => {
  it('renumbers the remaining slots after a middle slot is deleted', async () => {
    const { userToken, numericId } = await createTestUser()

    const slots = await createSlots(4, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const deleted = await deleteRoutineSlot({
      routineSlotId: slots[1].id,
      yoga,
      userToken,
    })
    expect(deleted.errors).toBeUndefined()
    expect(deleted.data?.deleteRoutineSlot?.deletedId).toBe(slots[1].id)

    const page = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(page.errors).toBeUndefined()
    expect(page.ids).toEqual([slots[0].id, slots[2].id, slots[3].id])
    expect(page.positions).toEqual([0, 1, 2])

    const liveRows = (
      await dayAndSectionRows({
        userId: numericId,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      })
    ).filter(row => row.deleted_at === null)
    expect(liveRows.map(row => row.position)).toEqual([0, 1, 2])
  })

  it('renumbers the remaining slots when the last slot is deleted', async () => {
    const { userToken } = await createTestUser()

    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'EVENING',
      userToken,
    })

    const deleted = await deleteRoutineSlot({
      routineSlotId: slots[2].id,
      yoga,
      userToken,
    })
    expect(deleted.errors).toBeUndefined()

    const page = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'EVENING',
    })
    expect(page.ids).toEqual([slots[0].id, slots[1].id])
    expect(page.positions).toEqual([0, 1])
  })

  it(`refuses to delete another user's slot and leaves both orders dense`, async () => {
    const { userToken } = await createTestUser()
    const other = await createTestUser()

    const mine = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const theirs = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken: other.userToken,
    })

    const forbidden = await deleteRoutineSlot({
      routineSlotId: theirs[0].id,
      yoga,
      userToken,
    })
    expect(forbidden.errors?.[0].message).toBe('Routine slot not found')

    const myPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    const theirPage = await queryDaySectionSlots({
      yoga,
      userToken: other.userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(myPage.ids).toEqual(mine.map(slot => slot.id))
    expect(myPage.positions).toEqual([0, 1])
    expect(theirPage.ids).toEqual(theirs.map(slot => slot.id))
    expect(theirPage.positions).toEqual([0, 1])
  })

  it('refuses a second delete of the same slot and leaves the order dense', async () => {
    const { userToken, numericId } = await createTestUser()

    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    await deleteRoutineSlot({
      routineSlotId: slots[1].id,
      yoga,
      userToken,
    })
    const secondDelete = await deleteRoutineSlot({
      routineSlotId: slots[1].id,
      yoga,
      userToken,
    })
    expect(secondDelete.errors?.[0].message).toBe('Routine slot not found')

    const page = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(page.ids).toEqual([slots[0].id, slots[2].id])
    expect(page.positions).toEqual([0, 1])

    const rows = await dayAndSectionRows({
      userId: numericId,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(rows.length).toBe(3)
    expect(rows.filter(row => row.deleted_at === null).length).toBe(2)
  })

  it('leaves other days and sections untouched when renumbering a deletion', async () => {
    const { userToken } = await createTestUser()

    const mondayMorning = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const mondayMidday = await createSlot({
      title: 'Monday midday',
      dayOfWeek: 'MONDAY',
      section: 'MIDDAY',
      userToken,
    })
    const tuesdayMorning = await createSlot({
      title: 'Tuesday morning',
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
      userToken,
    })

    await deleteRoutineSlot({
      routineSlotId: mondayMorning[0].id,
      yoga,
      userToken,
    })

    const morningPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    const middayPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MIDDAY',
    })
    const tuesdayPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
    })
    expect(morningPage.ids).toEqual([mondayMorning[1].id, mondayMorning[2].id])
    expect(morningPage.positions).toEqual([0, 1])
    expect(middayPage.ids).toEqual([mondayMidday.id])
    expect(middayPage.positions).toEqual([0])
    expect(tuesdayPage.ids).toEqual([tuesdayMorning.id])
    expect(tuesdayPage.positions).toEqual([0])
  })

  it('reports a not-found error without touching the order', async () => {
    const { userToken } = await createTestUser()

    const slots = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const missing = await executeGraphQL(
      graphql(`
        mutation DeleteMissingSlot($routineSlotId: ID!) {
          deleteRoutineSlot(routineSlotId: $routineSlotId) {
            deletedId
          }
        }
      `),
      { routineSlotId: toGlobalId('RoutineSlot', 999_999) },
      { yoga, userToken },
    )
    expect(missing.errors?.[0].message).toBe('Routine slot not found')
    expect(missing.data?.deleteRoutineSlot).toBeNull()

    const page = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(page.ids).toEqual(slots.map(slot => slot.id))
    expect(page.positions).toEqual([0, 1])
  })
})

describe('Reviving a deleted slot appends it at the end of its day and section', () => {
  it('revives into the same row, last, with exactly one live row per task', async () => {
    const { userToken, numericId } = await createTestUser()

    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    await deleteRoutineSlot({
      routineSlotId: slots[1].id,
      yoga,
      userToken,
    })

    const revived = await createRoutineSlot({
      input: {
        taskId: slots[1].task.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      },
      yoga,
      userToken,
    })
    expect(revived.errors).toBeUndefined()
    const revivedNode = revived.data?.createRoutineSlot?.routineSlotEdge.node
    assert(revivedNode !== undefined, 'slot revived')
    expect(revivedNode.id).toBe(slots[1].id)
    expect(revivedNode.position).toBe(2)

    const page = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(page.ids).toEqual([slots[0].id, slots[2].id, slots[1].id])
    expect(page.positions).toEqual([0, 1, 2])

    const rows = await dayAndSectionRows({
      userId: numericId,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(rows.length).toBe(3)
    expect(rows.filter(row => row.deleted_at === null).length).toBe(3)
    expect(rows.map(row => row.position)).toEqual([0, 1, 2])
    expect(new Set(rows.map(row => row.task_id)).size).toBe(3)
  })
})

describe('DaySectionSlots container reads', () => {
  it('returns the container with its day, section and position-ordered slots', async () => {
    const { userToken } = await createTestUser()

    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const page = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(page.errors).toBeUndefined()
    expect(page.containerId).toBe(encodeDaySectionSlotsId('MONDAY', 'MORNING'))
    expect(page.dayOfWeek).toBe('MONDAY')
    expect(page.section).toBe('MORNING')
    expect(page.ids).toEqual(slots.map(slot => slot.id))
    expect(page.positions).toEqual([0, 1, 2])
    expect(page.hasNextPage).toBe(false)

    const firstPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      first: 2,
    })
    expect(firstPage.ids).toEqual([slots[0].id, slots[1].id])
    expect(firstPage.hasNextPage).toBe(true)
    assert(firstPage.endCursor !== null, 'container page has an end cursor')

    const secondPage = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      first: 2,
      after: firstPage.endCursor,
    })
    expect(secondPage.ids).toEqual([slots[2].id])
    expect(secondPage.positions).toEqual([2])
    expect(secondPage.hasNextPage).toBe(false)
  })

  it('resolves the same container through node(id:) and rejects a malformed id', async () => {
    const { userToken } = await createTestUser()

    const slots = await createSlots(2, {
      dayOfWeek: 'WEDNESDAY',
      section: 'EVENING',
      userToken,
    })

    const containerId = encodeDaySectionSlotsId('WEDNESDAY', 'EVENING')
    const containerNode = await executeGraphQL(
      DaySectionSlotsNodeQuery,
      { id: containerId },
      { yoga, userToken },
    )
    expect(containerNode.errors).toBeUndefined()
    assert(
      containerNode.data?.node?.__typename === 'DaySectionSlots',
      'got a DaySectionSlots back',
    )
    expect(containerNode.data.node.id).toBe(containerId)
    expect(containerNode.data.node.dayOfWeek).toBe('WEDNESDAY')
    expect(containerNode.data.node.section).toBe('EVENING')
    expect(
      containerNode.data.node.slots.edges.map(edge => edge.node.id),
    ).toEqual(slots.map(slot => slot.id))

    for (const malformedId of [
      encodeGlobalId('DaySectionSlots', 'WEDNESDAY'),
      encodeGlobalId('DaySectionSlots', 'NOTADAY:EVENING'),
      encodeGlobalId('DaySectionSlots', 'WEDNESDAY:NIGHT'),
    ]) {
      const malformed = await executeGraphQL(
        DaySectionSlotsNodeQuery,
        { id: malformedId },
        { yoga, userToken },
      )
      expect(malformed.data?.node).toBeNull()
      expect(malformed.errors?.[0]?.extensions?.code).toBe('BAD_USER_INPUT')
    }
  })
})

const expectSectionOrder = async (
  userToken: string,
  target: { dayOfWeek: DayOfWeek; section: DaySection },
  slots: readonly { id: string }[],
) => {
  const page = await queryDaySectionSlots({ yoga, userToken, ...target })
  expect(page.errors).toBeUndefined()
  expect(page.ids).toEqual(slots.map(slot => slot.id))
  expect(page.positions).toEqual(slots.map((_slot, index) => index))
}

const edgeCursorFor = (slotId: string, position: number) => ({
  position,
  id: fromGlobalId(asGlobalId(slotId), 'RoutineSlot'),
})

interface UnusableIdResponse {
  moveRoutineSlot: { movedRoutineSlotEdge: { cursor: string } } | null
}

interface UnusableIdVariables {
  routineSlotId: GlobalId
  to?: SlotMoveDestination
}

describe('moveRoutineSlot', () => {
  it('reorders for each move target and reports the moved edge', async () => {
    const { userToken } = await createTestUser()
    const [first, second, third, fourth] = await createSlots(4, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const afterMove = await moveRoutineSlot({
      yoga,
      userToken,
      input: { routineSlotId: first.id, afterRoutineSlotId: third.id },
    })
    expect(afterMove.errors).toBeUndefined()
    expect(afterMove.section.ids).toEqual([
      second.id,
      third.id,
      first.id,
      fourth.id,
    ])
    expect(afterMove.section.positions).toEqual([0, 1, 2, 3])
    expect(afterMove.movedId).toBe(first.id)
    expect(afterMove.movedPosition).toBe(2)
    assert(afterMove.movedCursor !== null, 'moved edge has a cursor')
    expect(decodeBaseCursor(afterMove.movedCursor)).toEqual(
      edgeCursorFor(first.id, 2),
    )
    expect(afterMove.section.containerId).toBe(
      encodeDaySectionSlotsId('MONDAY', 'MORNING'),
    )
    expect(afterMove.section.dayOfWeek).toBe('MONDAY')
    expect(afterMove.section.section).toBe('MORNING')

    const beforeMove = await moveRoutineSlot({
      yoga,
      userToken,
      input: { routineSlotId: fourth.id, beforeRoutineSlotId: second.id },
    })
    expect(beforeMove.errors).toBeUndefined()
    expect(beforeMove.section.ids).toEqual([
      fourth.id,
      second.id,
      third.id,
      first.id,
    ])
    expect(beforeMove.movedPosition).toBe(0)
    assert(beforeMove.movedCursor !== null, 'moved edge has a cursor')
    expect(decodeBaseCursor(beforeMove.movedCursor)).toEqual(
      edgeCursorFor(fourth.id, 0),
    )

    const topMove = await moveRoutineSlot({
      yoga,
      userToken,
      input: { routineSlotId: first.id, to: 'TOP' },
    })
    expect(topMove.errors).toBeUndefined()
    expect(topMove.section.ids).toEqual([
      first.id,
      fourth.id,
      second.id,
      third.id,
    ])
    expect(topMove.movedPosition).toBe(0)

    const bottomMove = await moveRoutineSlot({
      yoga,
      userToken,
      input: { routineSlotId: second.id, to: 'BOTTOM' },
    })
    expect(bottomMove.errors).toBeUndefined()
    expect(bottomMove.section.ids).toEqual([
      first.id,
      fourth.id,
      third.id,
      second.id,
    ])
    expect(bottomMove.section.positions).toEqual([0, 1, 2, 3])
    expect(bottomMove.movedPosition).toBe(3)

    const expectedOrder = [first, fourth, third, second]
    await expectSectionOrder(
      userToken,
      { dayOfWeek: 'MONDAY', section: 'MORNING' },
      expectedOrder,
    )

    const container = await queryDaySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    assert(container.endCursor !== null, 'container section has an end cursor')
    expect(bottomMove.section.ids).toEqual(container.ids)
    expect(bottomMove.section.positions).toEqual(container.positions)
    expect(bottomMove.movedCursor).toEqual(container.endCursor)

    const daily = await queryDailySectionSlots({
      yoga,
      userToken,
      date: new Date('2025-12-08T12:00:00Z'),
      section: 'MORNING',
    })
    expect(daily.ids).toEqual(container.ids)
  })

  it('succeeds without changing the order when the move is already true', async () => {
    const { userToken } = await createTestUser()
    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const noOps = [
      { routineSlotId: slots[0].id, to: 'TOP' as const },
      { routineSlotId: slots[2].id, afterRoutineSlotId: slots[1].id },
      { routineSlotId: slots[0].id, beforeRoutineSlotId: slots[1].id },
      { routineSlotId: slots[2].id, to: 'BOTTOM' as const },
    ]

    for (const input of noOps) {
      const result = await moveRoutineSlot({ yoga, userToken, input })
      expect(result.errors).toBeUndefined()
      expect(result.section.ids).toEqual(slots.map(slot => slot.id))
      expect(result.section.positions).toEqual([0, 1, 2])
      expect(result.movedId).toBe(input.routineSlotId)
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'MORNING' },
        slots,
      )
    }
  })

  it('accepts a move in a single-slot day and section', async () => {
    const { userToken } = await createTestUser()
    const [only] = await createSlots(1, {
      dayOfWeek: 'MONDAY',
      section: 'EVENING',
      userToken,
    })

    for (const input of [
      { routineSlotId: only.id, to: 'TOP' as const },
      { routineSlotId: only.id, to: 'BOTTOM' as const },
    ]) {
      const result = await moveRoutineSlot({ yoga, userToken, input })
      expect(result.errors).toBeUndefined()
      expect(result.movedPosition).toBe(0)
      expect(result.section.ids).toEqual([only.id])
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'EVENING' },
        [only],
      )
    }
  })

  it('keeps every position dense when two moves are requested together', async () => {
    const { userToken, numericId } = await createTestUser()
    const slots = await createSlots(4, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const results = await Promise.all([
      moveRoutineSlot({
        yoga,
        userToken,
        input: { routineSlotId: slots[0].id, to: 'BOTTOM' },
      }),
      moveRoutineSlot({
        yoga,
        userToken,
        input: { routineSlotId: slots[3].id, to: 'TOP' },
      }),
    ])

    for (const result of results) {
      expect(result.errors).toBeUndefined()
      expect(new Set(result.section.ids).size).toBe(4)
      expect(result.section.positions).toEqual([0, 1, 2, 3])
    }

    // Either serialisation of these two writes ends in this order, so the
    // assertion holds whichever transaction the database ran first.
    await expectSectionOrder(
      userToken,
      { dayOfWeek: 'MONDAY', section: 'MORNING' },
      [slots[3], slots[1], slots[2], slots[0]],
    )

    const liveRows = (
      await dayAndSectionRows({
        userId: numericId,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      })
    ).filter(row => row.deleted_at === null)
    expect(new Set(liveRows.map(row => row.id)).size).toBe(4)
    expect(liveRows.map(row => row.position)).toEqual([0, 1, 2, 3])
  })

  it('keeps the moved slot edge identity intact', async () => {
    const { userToken, numericId } = await createTestUser()
    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const edgeIdentity = async () => {
      const rows = await dayAndSectionRows({
        userId: numericId,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
      })
      return rows
        .map(
          row => `${row.id}:${row.task_id}:${row.day_of_week}:${row.section}`,
        )
        .sort()
    }
    const before = await edgeIdentity()
    expect(before).toHaveLength(3)

    const result = await moveRoutineSlot({
      yoga,
      userToken,
      input: { routineSlotId: slots[2].id, beforeRoutineSlotId: slots[0].id },
    })
    expect(result.errors).toBeUndefined()
    expect(result.movedTaskId).toBe(slots[2].task.id)
    expect(result.movedDayOfWeek).toBe('MONDAY')
    expect(result.movedSection).toBe('MORNING')
    expect(result.movedPosition).toBe(0)

    expect(await edgeIdentity()).toEqual(before)
    await expectSectionOrder(
      userToken,
      { dayOfWeek: 'MONDAY', section: 'MORNING' },
      [slots[2], slots[0], slots[1]],
    )
  })

  it('keeps two sections of one day independent while reordering the other', async () => {
    const { userToken, numericId } = await createTestUser()

    const morningSlots: CreatedSlot[] = []
    const eveningSlots: CreatedSlot[] = []
    for (let index = 0; index < 3; index += 1) {
      const task = await createTask({
        title: `Shared task ${index}`,
        yoga,
        userToken,
      })
      const taskId = task.data?.createTask?.taskEdge.node.id
      assert(taskId !== undefined, 'task created')
      morningSlots.push(
        await createSlot({
          taskId,
          dayOfWeek: 'MONDAY',
          section: 'MORNING',
          userToken,
        }),
      )
      eveningSlots.push(
        await createSlot({
          taskId,
          dayOfWeek: 'MONDAY',
          section: 'EVENING',
          userToken,
        }),
      )
    }

    const result = await moveRoutineSlot({
      yoga,
      userToken,
      input: { routineSlotId: eveningSlots[2].id, to: 'TOP' },
    })
    expect(result.errors).toBeUndefined()
    expect(result.section.ids).toEqual([
      eveningSlots[2].id,
      eveningSlots[0].id,
      eveningSlots[1].id,
    ])

    await expectSectionOrder(
      userToken,
      { dayOfWeek: 'MONDAY', section: 'EVENING' },
      [eveningSlots[2], eveningSlots[0], eveningSlots[1]],
    )
    await expectSectionOrder(
      userToken,
      { dayOfWeek: 'MONDAY', section: 'MORNING' },
      morningSlots,
    )

    const morningRows = await dayAndSectionRows({
      userId: numericId,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    expect(morningRows.map(row => row.position)).toEqual([0, 1, 2])
    expect(morningRows.map(row => row.id)).toEqual(
      morningSlots.map(slot =>
        fromGlobalId(asGlobalId(slot.id), 'RoutineSlot'),
      ),
    )
  })

  it('rejects a target count other than one', async () => {
    const { userToken } = await createTestUser()
    const slots = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const cases: MoveRoutineSlotInput[] = [
      { routineSlotId: slots[0].id },
      {
        routineSlotId: slots[0].id,
        beforeRoutineSlotId: slots[1].id,
        afterRoutineSlotId: slots[2].id,
      },
      {
        routineSlotId: slots[0].id,
        beforeRoutineSlotId: slots[1].id,
        to: 'TOP',
      },
      {
        routineSlotId: slots[0].id,
        afterRoutineSlotId: slots[1].id,
        to: 'BOTTOM',
      },
      {
        routineSlotId: slots[0].id,
        beforeRoutineSlotId: slots[1].id,
        afterRoutineSlotId: slots[2].id,
        to: 'TOP',
      },
    ]

    for (const input of cases) {
      const result = await moveRoutineSlot({ yoga, userToken, input })
      expect(result.errors?.[0].extensions?.code).toBe('BAD_USER_INPUT')
      expect(result.errors?.[0].message).toBe(
        'Provide exactly one of beforeRoutineSlotId, afterRoutineSlotId or to',
      )
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'MORNING' },
        slots,
      )
    }
  })

  it('rejects moving a slot relative to itself', async () => {
    const { userToken } = await createTestUser()
    const slots = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    for (const input of [
      {
        routineSlotId: slots[0].id,
        beforeRoutineSlotId: slots[0].id,
      },
      {
        routineSlotId: slots[1].id,
        afterRoutineSlotId: slots[1].id,
      },
    ] satisfies MoveRoutineSlotInput[]) {
      const result = await moveRoutineSlot({ yoga, userToken, input })
      expect(result.errors?.[0].extensions?.code).toBe('BAD_USER_INPUT')
      expect(result.errors?.[0].message).toBe(
        'A routine slot cannot be moved relative to itself',
      )
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'MORNING' },
        slots,
      )
    }
  })

  it('rejects an anchor from another section or another day', async () => {
    const { userToken } = await createTestUser()
    const morning = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const midday = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MIDDAY',
      userToken,
    })
    const tuesday = await createSlots(2, {
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
      userToken,
    })

    const cases: MoveRoutineSlotInput[] = [
      { routineSlotId: morning[1].id, beforeRoutineSlotId: midday[0].id },
      { routineSlotId: morning[1].id, afterRoutineSlotId: tuesday[0].id },
    ]

    for (const input of cases) {
      const result = await moveRoutineSlot({ yoga, userToken, input })
      expect(result.errors?.[0].message).toBe(
        'Routine slot is not in the same day and section',
      )
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'MORNING' },
        morning,
      )
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'MIDDAY' },
        midday,
      )
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'TUESDAY', section: 'MORNING' },
        tuesday,
      )
    }
  })

  it('reports not found for unknown, deleted and other users slot ids without moving anything', async () => {
    const { userToken } = await createTestUser()
    const other = await createTestUser()

    const mine = await createSlots(3, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const theirs = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken: other.userToken,
    })

    await deleteRoutineSlot({ routineSlotId: mine[2].id, yoga, userToken })
    const remaining = [mine[0], mine[1]]
    const unknownId = toGlobalId('RoutineSlot', 999_999)

    const cases: MoveRoutineSlotInput[] = [
      { routineSlotId: unknownId, to: 'TOP' },
      { routineSlotId: mine[2].id, to: 'BOTTOM' },
      { routineSlotId: theirs[0].id, to: 'TOP' },
      { routineSlotId: remaining[0].id, beforeRoutineSlotId: unknownId },
      { routineSlotId: remaining[0].id, afterRoutineSlotId: mine[2].id },
      { routineSlotId: remaining[1].id, beforeRoutineSlotId: theirs[1].id },
    ]

    for (const input of cases) {
      const result = await moveRoutineSlot({ yoga, userToken, input })
      expect(result.errors?.[0].message).toBe('Routine slot not found')
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'MORNING' },
        remaining,
      )
      await expectSectionOrder(
        other.userToken,
        { dayOfWeek: 'MONDAY', section: 'MORNING' },
        theirs,
      )
    }
  })

  it('surfaces the global id decoder message, with no error code, for an unusable slot id', async () => {
    const { userToken } = await createTestUser()
    const slots = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })
    const notASlot = await createTask({ title: 'A task id', yoga, userToken })
    const taskId = notASlot.data!.createTask!.taskEdge.node.id

    const cases: [GlobalId, string][] = [
      [
        asGlobalId('not-a-global-id'),
        'Invalid global ID format: not-a-global-id',
      ],
      [taskId, 'Expected global ID of type RoutineSlot, got Task'],
    ]

    for (const [routineSlotId, message] of cases) {
      const result = await executeGraphQL<
        UnusableIdResponse,
        UnusableIdVariables
      >(
        parse(`
          mutation MoveSlotWithUnusableId(
            $routineSlotId: ID!
            $to: SlotMoveDestination
          ) {
            moveRoutineSlot(input: { routineSlotId: $routineSlotId, to: $to }) {
              movedRoutineSlotEdge {
                cursor
              }
            }
          }
        `),
        { routineSlotId, to: 'TOP' },
        { yoga, userToken },
      )
      expect(result.errors?.[0].message).toBe(message)
      expect(result.errors?.[0].extensions?.code ?? null).toBeNull()
      expect(result.data?.moveRoutineSlot).toBeNull()
      await expectSectionOrder(
        userToken,
        { dayOfWeek: 'MONDAY', section: 'MORNING' },
        slots,
      )
    }
  })

  it('rejects an unauthenticated move and leaves the order unchanged', async () => {
    const { userToken } = await createTestUser()
    const slots = await createSlots(2, {
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      userToken,
    })

    const anonymous = await moveRoutineSlot({
      yoga,
      input: { routineSlotId: slots[1].id, to: 'TOP' },
    })
    expect(anonymous.errors?.[0].extensions?.code).toBe('UNAUTHENTICATED')

    await expectSectionOrder(
      userToken,
      { dayOfWeek: 'MONDAY', section: 'MORNING' },
      slots,
    )
  })
})
