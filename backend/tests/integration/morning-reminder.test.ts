import { assert, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAllTables } from '../helpers/db.ts'
import { createTestUser } from '../helpers/auth.ts'
import { createTask } from '../helpers/tasks.ts'
import { createRoutineSlot } from '../helpers/routine-slot.ts'
import {
  completeRoutineSlot,
  uncompleteRoutineSlot,
} from '../helpers/task-completion.ts'
import { createTestApp, type YogaApp } from '../helpers/graphql.ts'
import {
  createFakePushSender,
  insertPushSubscriptionRow,
  pushEndpointFor,
} from '../helpers/push.ts'
import { db } from '../../src/database/index.ts'
import type { GlobalId } from '../../src/globalId.ts'
import { fromGlobalId } from '../../src/globalId.ts'
import type { DayOfWeek, DaySection } from '../../src/database/types.ts'
import {
  evaluateMorningReminder,
  evaluateMorningReminderForAllUsers,
  MAX_DELIVERY_ATTEMPTS,
  SEND_CONCURRENCY,
} from '../../src/push/morning-reminder.ts'
import {
  computeNextReminderFireTime,
  startMorningReminderScheduler,
} from '../../src/push/reminder-scheduler.ts'
import { getCurrentTimestamp } from '../../src/database/time.ts'
import {
  NOTIFICATION_BODY,
  NOTIFICATION_TAG,
  NOTIFICATION_TITLE,
} from '../../src/push/push-payload.ts'

let yoga: YogaApp

/**
 * Brisbane is UTC+10 all year, so these instants are exact.
 */
/** 09:00 Tuesday in Brisbane, while UTC is still Monday the 14th. */
const TUESDAY_0900 = new Date('2026-09-14T23:00:00.000Z')
const TUESDAY_2300 = new Date('2026-09-15T13:00:00.000Z')
const WEDNESDAY_0900 = new Date('2026-09-15T23:00:00.000Z')
const THURSDAY_0900 = new Date('2026-09-16T23:00:00.000Z')

const createSlot = async ({
  userToken,
  dayOfWeek,
  section,
  title,
}: {
  userToken: string
  dayOfWeek: DayOfWeek
  section: DaySection
  title: string
}): Promise<GlobalId> => {
  const task = await createTask({ title, yoga, userToken })
  const taskId = task.data?.createTask?.taskEdge.node.id
  assert(taskId !== undefined, 'task was created')

  const slot = await createRoutineSlot({
    input: { taskId, dayOfWeek, section },
    yoga,
    userToken,
  })
  const slotId = slot.data?.createRoutineSlot?.routineSlotEdge.node.id
  assert(slotId !== undefined, 'routine slot was created')

  return slotId
}

const insertCompletion = async (
  userId: number,
  routineSlotId: GlobalId,
  completedAt: Date,
) => {
  await db
    .insertInto('task_completions')
    .values({
      user_id: userId,
      routine_slot_id: fromGlobalId(routineSlotId, 'RoutineSlot'),
      completed_at: completedAt.toISOString(),
      created_at: getCurrentTimestamp(),
    })
    .execute()
}

const deliveriesFor = async (userId: number) =>
  await db
    .selectFrom('morning_reminder_deliveries')
    .selectAll()
    .where('user_id', '=', userId)
    .orderBy('id', 'asc')
    .execute()

const subscriptionIdsFor = async (userId: number) =>
  (
    await db
      .selectFrom('push_subscriptions')
      .select('id')
      .where('user_id', '=', userId)
      .execute()
  ).map(row => row.id)

const silentLog = { info: () => {}, error: () => {} }

beforeAll(async () => {
  const testApp = await createTestApp()
  yoga = testApp.yoga
})

beforeEach(async () => {
  await clearAllTables()
})

describe('evaluateMorningReminder', () => {
  it('sends when a morning slot is scheduled and nothing is complete', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))

    const pushSender = createFakePushSender()
    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result).toMatchObject({
      userId: numericId,
      dayKey: '2026-09-16',
      status: 'SENT',
      subscriptionsSent: 1,
      error: null,
      alreadyRecorded: false,
    })
    expect(pushSender.sends).toHaveLength(1)
    expect(pushSender.sends[0].payload).toEqual({
      title: NOTIFICATION_TITLE,
      body: NOTIFICATION_BODY,
      tag: NOTIFICATION_TAG,
      url: '/?date=2026-09-16',
    })
  })

  it('skips when a morning task is already complete for the Brisbane day', async () => {
    const { userToken, numericId } = await createTestUser()
    const slotId = await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))
    await insertCompletion(
      numericId,
      slotId,
      new Date('2026-09-15T22:15:00.000Z'),
    )

    const pushSender = createFakePushSender()
    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result.status).toBe('SKIPPED_ALREADY_COMPLETE')
    expect(pushSender.sends).toHaveLength(0)
  })

  it('still sends when only a midday task has been completed today', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const middaySlot = await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MIDDAY',
      title: 'Walk',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))
    await insertCompletion(numericId, middaySlot, WEDNESDAY_0900)

    const pushSender = createFakePushSender()
    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result.status).toBe('SENT')
    expect(pushSender.sends).toHaveLength(1)
  })

  it('skips when nothing is scheduled for morning on that weekday', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'EVENING',
      title: 'Read',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))

    const pushSender = createFakePushSender()
    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result.status).toBe('SKIPPED_NO_SLOTS')
    expect(pushSender.sends).toHaveLength(0)
  })

  it('skips when the user has no push subscriptions', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })

    const pushSender = createFakePushSender()
    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result.status).toBe('SKIPPED_NO_SUBSCRIPTION')
    expect(pushSender.sends).toHaveLength(0)
  })

  it('records each day once and never re-sends for the same day key', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))

    const pushSender = createFakePushSender()
    const first = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })
    const second = await evaluateMorningReminder(db, {
      userId: numericId,
      now: new Date('2026-09-15T23:30:00.000Z'),
      pushSender,
    })

    expect(first.status).toBe('SENT')
    expect(second).toMatchObject({
      status: 'SENT',
      alreadyRecorded: true,
      subscriptionsSent: 1,
    })
    expect(pushSender.sends).toHaveLength(1)
    expect(await deliveriesFor(numericId)).toHaveLength(1)
  })

  it('never retracts a sent reminder when the task is unticked later', async () => {
    const { userToken, numericId } = await createTestUser()
    const slotId = await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))

    const pushSender = createFakePushSender()
    await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    await insertCompletion(
      numericId,
      slotId,
      new Date('2026-09-15T23:45:00.000Z'),
    )
    const afterCompletion = await evaluateMorningReminder(db, {
      userId: numericId,
      now: new Date('2026-09-15T23:50:00.000Z'),
      pushSender,
    })

    expect(afterCompletion.status).toBe('SENT')
    expect(pushSender.sends).toHaveLength(1)
  })

  it('uses the Brisbane weekday, not the UTC weekday, to pick slots and day', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))

    const pushSender = createFakePushSender()
    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: TUESDAY_0900,
      pushSender,
    })

    expect(result).toMatchObject({ dayKey: '2026-09-15', status: 'SENT' })
    expect(pushSender.sends).toHaveLength(1)
  })

  it('counts a completion inside the Brisbane day bounds and not the next day', async () => {
    const { userToken, numericId } = await createTestUser()
    const tuesdaySlot = await createSlot({
      userToken,
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))

    // 2026-09-14T14:30Z is 2026-09-15 00:30 Brisbane, so it belongs to Tuesday.
    await insertCompletion(
      numericId,
      tuesdaySlot,
      new Date('2026-09-14T14:30:00.000Z'),
    )

    const pushSender = createFakePushSender()
    const tuesdayRun = await evaluateMorningReminder(db, {
      userId: numericId,
      now: TUESDAY_2300,
      pushSender,
    })

    expect(tuesdayRun).toMatchObject({
      dayKey: '2026-09-15',
      status: 'SKIPPED_ALREADY_COMPLETE',
    })

    const wednesdayRun = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(wednesdayRun).toMatchObject({
      dayKey: '2026-09-16',
      status: 'SENT',
    })
    expect(pushSender.sends).toHaveLength(1)
  })

  it('sends when the only morning completion for the day is unticked', async () => {
    const { userToken, numericId } = await createTestUser()
    const slotId = await createSlot({
      userToken,
      dayOfWeek: 'THURSDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(db, numericId, pushEndpointFor('iphone'))

    const completion = await completeRoutineSlot({
      routineSlotId: slotId,
      date: THURSDAY_0900,
      yoga,
      userToken,
    })
    expect(completion.errors).toBeUndefined()

    const uncompletion = await uncompleteRoutineSlot({
      routineSlotId: slotId,
      date: THURSDAY_0900,
      yoga,
      userToken,
    })
    expect(uncompletion.errors).toBeUndefined()

    const pushSender = createFakePushSender()
    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: THURSDAY_0900,
      pushSender,
    })

    expect(result.status).toBe('SENT')
    expect(pushSender.sends).toHaveLength(1)
  })

  it('prunes subscriptions the push service reports as gone', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const deadEndpoint = pushEndpointFor('dead')
    const liveEndpoint = pushEndpointFor('live')
    await insertPushSubscriptionRow(db, numericId, deadEndpoint)
    await insertPushSubscriptionRow(db, numericId, liveEndpoint)

    const pushSender = createFakePushSender()
    pushSender.setResult(deadEndpoint, 'expired')

    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result).toMatchObject({ status: 'SENT', subscriptionsSent: 1 })
    expect(pushSender.sends.map(send => send.endpoint)).toEqual([
      deadEndpoint,
      liveEndpoint,
    ])
    expect(await subscriptionIdsFor(numericId)).toHaveLength(1)
  })

  it('records FAILED when every send fails, keeping the subscriptions', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const endpoint = pushEndpointFor('flaky')
    await insertPushSubscriptionRow(db, numericId, endpoint)

    const pushSender = createFakePushSender()
    pushSender.setResult(endpoint, { failed: 'Push service responded 502' })

    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result).toMatchObject({
      status: 'FAILED',
      subscriptionsSent: 0,
      error: 'Push service responded 502',
    })
    expect(await subscriptionIdsFor(numericId)).toHaveLength(1)

    const rows = await deliveriesFor(numericId)
    expect(rows).toHaveLength(1)
    expect(rows[0].status).toBe('FAILED')
  })

  it('retries a failed day on the next evaluation and records the sent day', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const endpoint = pushEndpointFor('flaky')
    await insertPushSubscriptionRow(db, numericId, endpoint)

    const pushSender = createFakePushSender()
    pushSender.setResult(endpoint, { failed: 'Push service responded 502' })

    const first = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })
    expect(first).toMatchObject({ status: 'FAILED', attempts: 1 })

    pushSender.setResult(endpoint, 'sent')

    const retry = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(retry).toMatchObject({
      status: 'SENT',
      subscriptionsSent: 1,
      attempts: 2,
      alreadyRecorded: false,
    })
    expect(pushSender.sends).toHaveLength(2)

    const rows = await deliveriesFor(numericId)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      status: 'SENT',
      attempts: 2,
      subscriptions_sent: 1,
    })
  })

  it('stops retrying a day once the attempt cap is reached', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const endpoint = pushEndpointFor('always-broken')
    await insertPushSubscriptionRow(db, numericId, endpoint)

    const pushSender = createFakePushSender()
    pushSender.setResult(endpoint, { failed: 'Push service responded 503' })

    const statuses: string[] = []
    for (let run = 0; run < MAX_DELIVERY_ATTEMPTS; run += 1) {
      const result = await evaluateMorningReminder(db, {
        userId: numericId,
        now: WEDNESDAY_0900,
        pushSender,
      })
      statuses.push(result.status)
      expect(result.alreadyRecorded, `run ${run + 1}`).toBe(false)
    }

    expect(statuses).toEqual(Array(MAX_DELIVERY_ATTEMPTS).fill('FAILED'))
    expect(pushSender.sends).toHaveLength(MAX_DELIVERY_ATTEMPTS)

    const exhausted = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(exhausted).toMatchObject({
      status: 'FAILED',
      attempts: MAX_DELIVERY_ATTEMPTS,
      alreadyRecorded: true,
    })
    expect(pushSender.sends, 'the cap stops the retries').toHaveLength(
      MAX_DELIVERY_ATTEMPTS,
    )
  })

  it('re-sends a day that already succeeded when forced', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const endpoint = pushEndpointFor('iphone')
    await insertPushSubscriptionRow(db, numericId, endpoint)

    const pushSender = createFakePushSender()

    await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    const unforced = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })
    expect(unforced).toMatchObject({ alreadyRecorded: true })

    const forced = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
      force: true,
    })

    expect(forced).toMatchObject({
      status: 'SENT',
      attempts: 2,
      alreadyRecorded: false,
    })
    expect(pushSender.sends).toHaveLength(2)
  })

  it('records FAILED when the sender itself throws', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const endpoint = pushEndpointFor('exploding')
    await insertPushSubscriptionRow(db, numericId, endpoint)

    const pushSender = createFakePushSender()
    pushSender.setThrow(endpoint, new Error('socket hang up'))

    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result).toMatchObject({
      status: 'FAILED',
      subscriptionsSent: 0,
      attempts: 1,
    })
    expect(result.error).toContain('socket hang up')

    const rows = await deliveriesFor(numericId)
    expect(rows, 'the throw still leaves a row behind').toHaveLength(1)
    expect(rows[0].status).toBe('FAILED')
  })

  it('sends to several subscriptions at once, up to the concurrency limit', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })

    for (let device = 0; device < SEND_CONCURRENCY + 2; device += 1) {
      await insertPushSubscriptionRow(
        db,
        numericId,
        pushEndpointFor(`device-${device}`),
      )
    }

    const pushSender = createFakePushSender()

    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result).toMatchObject({
      status: 'SENT',
      subscriptionsSent: SEND_CONCURRENCY + 2,
    })
    expect(
      pushSender.maxInFlight,
      'the fan-out is parallel, not strictly sequential',
    ).toBe(SEND_CONCURRENCY)
  })

  it('delivers a day once when two evaluations overlap', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const endpoints = [pushEndpointFor('iphone'), pushEndpointFor('ipad')]
    for (const endpoint of endpoints) {
      await insertPushSubscriptionRow(db, numericId, endpoint)
    }

    const now = WEDNESDAY_0900

    // The overlap is forced at the async boundary rather than raced on timers:
    // the first run stays inside `send` until the test lets it out.
    let releaseSends!: () => void
    const sendGate = new Promise<void>(resolve => {
      releaseSends = resolve
    })

    const pushSender = createFakePushSender()
    pushSender.blockSends(sendGate)

    const settled = Promise.all([
      evaluateMorningReminder(db, { userId: numericId, now, pushSender }),
      evaluateMorningReminder(db, { userId: numericId, now, pushSender }),
    ])

    await vi.waitFor(() =>
      expect(pushSender.sends).toHaveLength(endpoints.length),
    )

    const midFlight = await deliveriesFor(numericId)
    expect(
      midFlight[0]?.status,
      'the day is claimed before the first send',
    ).toBe('PENDING')

    releaseSends()

    const [first, second] = await settled

    expect(
      pushSender.sends,
      'only the run that claimed the day sends',
    ).toHaveLength(endpoints.length)
    expect(first).toMatchObject({ status: 'SENT', alreadyRecorded: false })
    expect(second.alreadyRecorded, 'the other run stands down').toBe(true)

    const rows = await deliveriesFor(numericId)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      status: 'SENT',
      subscriptions_sent: endpoints.length,
      attempts: 1,
    })
  })

  it('reports no subscription once every stored subscription turns out to be dead', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    const endpoint = pushEndpointFor('all-dead')
    await insertPushSubscriptionRow(db, numericId, endpoint)

    const pushSender = createFakePushSender()
    pushSender.setResult(endpoint, 'expired')

    const result = await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(result.status).toBe('SKIPPED_NO_SUBSCRIPTION')
    expect(await subscriptionIdsFor(numericId)).toHaveLength(0)
  })

  it('evaluates every user independently', async () => {
    const owner = await createTestUser()
    const other = await createTestUser()

    await createSlot({
      userToken: owner.userToken,
      dayOfWeek: 'WEDNESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })
    await insertPushSubscriptionRow(
      db,
      owner.numericId,
      pushEndpointFor('owner'),
    )

    const pushSender = createFakePushSender()
    const results = await evaluateMorningReminderForAllUsers(db, {
      now: WEDNESDAY_0900,
      pushSender,
    })

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({
      userId: owner.numericId,
      status: 'SENT',
    })
    expect(results[1]).toMatchObject({
      userId: other.numericId,
      status: 'SKIPPED_NO_SLOTS',
    })
    expect(pushSender.sends).toHaveLength(1)
  })

  it('stores one delivery row per evaluated day', async () => {
    const { userToken, numericId } = await createTestUser()
    await createSlot({
      userToken,
      dayOfWeek: 'TUESDAY',
      section: 'MORNING',
      title: 'Stretch',
    })

    await evaluateMorningReminder(db, {
      userId: numericId,
      now: TUESDAY_0900,
      pushSender: createFakePushSender(),
    })
    await evaluateMorningReminder(db, {
      userId: numericId,
      now: WEDNESDAY_0900,
      pushSender: createFakePushSender(),
    })

    const rows = await deliveriesFor(numericId)
    expect(rows.map(row => [row.day_key, row.status])).toEqual([
      ['2026-09-15', 'SKIPPED_NO_SUBSCRIPTION'],
      ['2026-09-16', 'SKIPPED_NO_SLOTS'],
    ])
  })
})

describe('reminder scheduler clock', () => {
  it('fires at today’s 09:00 Brisbane when now is before it', () => {
    expect(
      computeNextReminderFireTime(new Date('2026-09-15T22:00:00.000Z')),
    ).toEqual(new Date('2026-09-15T23:00:00.000Z'))
  })

  it('fires tomorrow when now is a millisecond past 09:00 Brisbane', () => {
    expect(
      computeNextReminderFireTime(new Date('2026-09-15T23:00:00.001Z')),
    ).toEqual(new Date('2026-09-16T23:00:00.000Z'))
  })

  it('rolls the day key over month boundaries without host-timezone help', () => {
    expect(
      computeNextReminderFireTime(new Date('2026-09-30T23:00:00.001Z')),
    ).toEqual(new Date('2026-10-01T23:00:00.000Z'))
  })

  it('keeps the fire time on the Brisbane wall clock', () => {
    expect(
      computeNextReminderFireTime(new Date('2026-09-30T13:30:00.000Z')),
    ).toEqual(new Date('2026-09-30T23:00:00.000Z'))
  })

  it('runs the evaluation at 09:00 Brisbane and re-arms the next day', async () => {
    vi.useFakeTimers()

    try {
      vi.setSystemTime(new Date('2026-09-15T22:00:00.000Z'))
      const onFire = vi.fn(async () => {})
      const scheduler = startMorningReminderScheduler({
        onFire,
        log: silentLog,
      })

      await vi.advanceTimersByTimeAsync(60 * 60 * 1000)

      expect(onFire).toHaveBeenCalledTimes(1)
      expect(onFire).toHaveBeenCalledWith(new Date('2026-09-15T23:00:00.000Z'))

      await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)

      expect(onFire).toHaveBeenCalledTimes(2)
      expect(onFire).toHaveBeenLastCalledWith(
        new Date('2026-09-16T23:00:00.000Z'),
      )

      scheduler.stop()
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not fire after stop clears the pending timer', async () => {
    vi.useFakeTimers()

    try {
      vi.setSystemTime(new Date('2026-09-15T22:00:00.000Z'))
      const onFire = vi.fn(async () => {})
      const scheduler = startMorningReminderScheduler({
        onFire,
        log: silentLog,
      })

      scheduler.stop()
      await vi.advanceTimersByTimeAsync(48 * 60 * 60 * 1000)

      expect(onFire).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('logs a failing run and keeps the daily timer armed', async () => {
    vi.useFakeTimers()

    try {
      vi.setSystemTime(new Date('2026-09-15T22:00:00.000Z'))
      const onFire = vi.fn(async () => {})
      onFire.mockRejectedValueOnce(new Error('push service unreachable'))

      const errors: unknown[] = []
      const scheduler = startMorningReminderScheduler({
        onFire,
        log: { info: () => {}, error: error => errors.push(error) },
      })

      await vi.advanceTimersByTimeAsync(60 * 60 * 1000)

      expect(errors).toEqual([new Error('push service unreachable')])
      expect(onFire).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)

      expect(onFire).toHaveBeenCalledTimes(2)

      scheduler.stop()
    } finally {
      vi.useRealTimers()
    }
  })

  it('lets an in-flight run settle before stop resolves', async () => {
    vi.useFakeTimers()

    try {
      vi.setSystemTime(new Date('2026-09-15T22:00:00.000Z'))

      let releaseRun!: () => void
      const runGate = new Promise<void>(resolve => {
        releaseRun = resolve
      })
      let runFinished = false

      const scheduler = startMorningReminderScheduler({
        onFire: async () => {
          await runGate
          runFinished = true
        },
        log: silentLog,
      })

      await vi.advanceTimersByTimeAsync(60 * 60 * 1000)

      let stopResolved = false
      const stopped = scheduler.stop().then(() => {
        stopResolved = true
      })

      await vi.advanceTimersByTimeAsync(0)
      expect(stopResolved, 'stop waits while the run is mid-send').toBe(false)

      releaseRun()
      await stopped

      expect(runFinished, 'the interrupted run finishes its send').toBe(true)

      await vi.advanceTimersByTimeAsync(48 * 60 * 60 * 1000)
      expect(stopResolved, 'stopping still disarms the daily timer').toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })
})
