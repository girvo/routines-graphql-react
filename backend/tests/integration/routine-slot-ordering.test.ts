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
  queryWeeklySectionSlots,
  queryDailySectionSlots,
} from '../helpers/routine-slot.ts'
import { graphql } from '../gql/gql.ts'
import { db } from '../../src/database/index.ts'
import { asGlobalId, fromGlobalId, toGlobalId } from '../../src/globalId.ts'
import { decodeBaseCursor } from '../../src/graphql/cursor.ts'
import type { DayOfWeek, DaySection } from '../../src/database/types.ts'
import type { GlobalId } from '../../src/globalId.ts'

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

    const page = await queryWeeklySectionSlots({
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
      const page = await queryWeeklySectionSlots({
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

    const firstPage = await queryWeeklySectionSlots({
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

    const secondPage = await queryWeeklySectionSlots({
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

    const thirdPage = await queryWeeklySectionSlots({
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

  it('mirrors the weekly order in dailyRoutine with position cursors', async () => {
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

    const weekly = await queryWeeklySectionSlots({
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
    expect(daily.ids).toEqual(weekly.ids)
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

    const morningSection = await queryWeeklySectionSlots({
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
  it('renumbers the survivors of a deleted middle slot densely', async () => {
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

    const page = await queryWeeklySectionSlots({
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

  it('renumbers the survivors when the last slot is deleted', async () => {
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

    const page = await queryWeeklySectionSlots({
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

    const myPage = await queryWeeklySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    const theirPage = await queryWeeklySectionSlots({
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

    const page = await queryWeeklySectionSlots({
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

    const morningPage = await queryWeeklySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    })
    const middayPage = await queryWeeklySectionSlots({
      yoga,
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MIDDAY',
    })
    const tuesdayPage = await queryWeeklySectionSlots({
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

    const page = await queryWeeklySectionSlots({
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

    const page = await queryWeeklySectionSlots({
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
