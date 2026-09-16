import type { Kysely } from 'kysely'
import type {
  Database,
  DayOfWeek,
  MorningReminderStatus,
} from '../database/types.ts'
import { getCurrentTimestamp } from '../database/time.ts'
import {
  getUserDayBoundsUtc,
  getUserDayKey,
  getUserDayOfWeek,
} from '../user-timezone.ts'
import { createPushSubscriptionRepository } from './push-repository.ts'
import { buildMorningReminderPayload } from './push-payload.ts'
import type { PushSender } from './push-sender.ts'

export interface MorningReminderDeps {
  userId: number
  now: Date
  pushSender: PushSender
  /**
   * Operator recovery: re-evaluate a day that already has a delivery row, which
   * is how a `SENT` day can be re-delivered or a stuck `PENDING` row unstuck.
   */
  force?: boolean
}

export interface MorningReminderResult {
  userId: number
  dayKey: string
  status: MorningReminderStatus
  subscriptionsSent: number
  error: string | null
  attempts: number
  /** True when this day had already been evaluated before the call. */
  alreadyRecorded: boolean
}

interface DeliveryRow {
  id: number
  user_id: number
  day_key: string
  status: MorningReminderStatus
  subscriptions_sent: number
  error: string | null
  attempts: number
}

/**
 * A `FAILED` day is retried by the next daily run, but only this many times in
 * total, so a permanently broken push service cannot pin the reminder open
 * forever.
 */
export const MAX_DELIVERY_ATTEMPTS = 3

/**
 * `error` is operator-facing only, but it holds text from an attacker-chosen
 * push service, so it is capped rather than stored verbatim.
 */
const MAX_ERROR_CHARS = 1000

const capError = (error: string | null): string | null =>
  error === null || error.length <= MAX_ERROR_CHARS
    ? error
    : `${error.slice(0, MAX_ERROR_CHARS - 1)}…`

const describeThrown = (error: unknown): string =>
  error instanceof Error ? `${error.name}: ${error.message}` : String(error)

/**
 * The fan-out is independent per subscription, so it runs a handful at a time:
 * strictly sequential sends mean one slow push service delays every other
 * device, while unbounded parallelism would hammer the services at once.
 */
export const SEND_CONCURRENCY = 4

const chunk = <T>(items: T[], size: number): T[][] => {
  const groups: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size))
  }

  return groups
}

const findDelivery = async (
  db: Kysely<Database>,
  userId: number,
  dayKey: string,
): Promise<DeliveryRow | undefined> =>
  db
    .selectFrom('morning_reminder_deliveries')
    .selectAll()
    .where('user_id', '=', userId)
    .where('day_key', '=', dayKey)
    .executeTakeFirst()

/**
 * Only a `FAILED` day with attempts left is worth evaluating again. `PENDING`
 * means another run currently owns the day, and every `SKIPPED_*` verdict was
 * reached from data that will not change by retrying it a minute later.
 */
const isRetryable = (row: DeliveryRow): boolean =>
  row.status === 'FAILED' && row.attempts < MAX_DELIVERY_ATTEMPTS

/**
 * Claim-then-send: the row for the day is written as `PENDING` *before* any
 * send, and the winner of the claim is the only run that sends. Without this the
 * guard is a plain read followed by an insert several awaits later, so two
 * overlapping runs both deliver and one of them still reports "already
 * recorded".
 */
const claimDelivery = async (
  db: Kysely<Database>,
  input: {
    userId: number
    dayKey: string
    existing?: DeliveryRow
    force: boolean
  },
): Promise<DeliveryRow | null> => {
  if (input.existing) {
    let claim = db
      .updateTable('morning_reminder_deliveries')
      .set({ status: 'PENDING' })
      .where('id', '=', input.existing.id)

    if (!input.force) {
      claim = claim.where('status', '<>', 'PENDING')
    }

    return (await claim.returningAll().executeTakeFirst()) ?? null
  }

  return (
    (await db
      .insertInto('morning_reminder_deliveries')
      .values({
        user_id: input.userId,
        day_key: input.dayKey,
        status: 'PENDING',
        subscriptions_sent: 0,
        error: null,
        attempts: 0,
        created_at: getCurrentTimestamp(),
      })
      .onConflict(oc => oc.columns(['user_id', 'day_key']).doNothing())
      .returningAll()
      .executeTakeFirst()) ?? null
  )
}

const hasMorningSlots = async (
  db: Kysely<Database>,
  userId: number,
  dayOfWeek: DayOfWeek,
): Promise<boolean> => {
  const slot = await db
    .selectFrom('routine_slots')
    .select('id')
    .where('user_id', '=', userId)
    .where('day_of_week', '=', dayOfWeek)
    .where('section', '=', 'MORNING')
    .where('deleted_at', 'is', null)
    .limit(1)
    .executeTakeFirst()

  return slot !== undefined
}

const hasMorningCompletionToday = async (
  db: Kysely<Database>,
  userId: number,
  now: Date,
): Promise<boolean> => {
  const { start, end } = getUserDayBoundsUtc(now)

  const completion = await db
    .selectFrom('task_completions')
    .innerJoin(
      'routine_slots',
      'task_completions.routine_slot_id',
      'routine_slots.id',
    )
    .select('task_completions.id')
    .where('task_completions.user_id', '=', userId)
    .where('routine_slots.section', '=', 'MORNING')
    .where('routine_slots.deleted_at', 'is', null)
    .where('task_completions.completed_at', '>=', start.toISOString())
    .where('task_completions.completed_at', '<=', end.toISOString())
    .limit(1)
    .executeTakeFirst()

  return completion !== undefined
}

const toResult = (
  row: DeliveryRow,
  alreadyRecorded: boolean,
): MorningReminderResult => ({
  userId: row.user_id,
  dayKey: row.day_key,
  status: row.status,
  subscriptionsSent: row.subscriptions_sent,
  error: row.error,
  attempts: row.attempts,
  alreadyRecorded,
})

/**
 * The single daily decision point for the morning reminder. Every branch ends
 * by writing the day's row, so an evaluation is never invisible: a row that is
 * absent is indistinguishable from a server that was down at 09:00.
 */
export const evaluateMorningReminder = async (
  db: Kysely<Database>,
  deps: MorningReminderDeps,
): Promise<MorningReminderResult> => {
  const { userId, now, pushSender, force = false } = deps
  const dayKey = getUserDayKey(now)

  const existing = await findDelivery(db, userId, dayKey)
  if (existing && !force && !isRetryable(existing)) {
    return toResult(existing, true)
  }

  const claimed = await claimDelivery(db, { userId, dayKey, existing, force })
  if (!claimed) {
    const raced = await findDelivery(db, userId, dayKey)
    if (raced) return toResult(raced, true)

    throw new Error(`Morning delivery for ${dayKey} could not be claimed`)
  }

  const record = async (
    status: MorningReminderStatus,
    subscriptionsSent = 0,
    error: string | null = null,
  ): Promise<MorningReminderResult> =>
    toResult(
      await db
        .updateTable('morning_reminder_deliveries')
        .set({
          status,
          subscriptions_sent: subscriptionsSent,
          error: capError(error),
          attempts: claimed.attempts + 1,
        })
        .where('id', '=', claimed.id)
        .returningAll()
        .executeTakeFirstOrThrow(),
      false,
    )

  const payload = buildMorningReminderPayload(dayKey)
  const failures: string[] = []
  let sent = 0

  const dayOfWeek = getUserDayOfWeek(now)
  const pushRepo = createPushSubscriptionRepository(db)

  const deliver = async (
    subscription: Awaited<ReturnType<typeof pushRepo.findByUserId>>[number],
  ): Promise<'sent' | 'pruned' | { failed: string }> => {
    const result = await pushSender.send(
      {
        endpoint: subscription.endpoint,
        p256dhKey: subscription.p256dh_key,
        authKey: subscription.auth_key,
      },
      payload,
    )

    if (result !== 'expired') return result

    await pushRepo.deleteById(subscription.id)

    return 'pruned'
  }

  try {
    if (!(await hasMorningSlots(db, userId, dayOfWeek))) {
      return record('SKIPPED_NO_SLOTS')
    }

    if (await hasMorningCompletionToday(db, userId, now)) {
      return record('SKIPPED_ALREADY_COMPLETE')
    }

    const subscriptions = await pushRepo.findByUserId(userId)

    if (subscriptions.length === 0) {
      return record('SKIPPED_NO_SUBSCRIPTION')
    }

    for (const group of chunk(subscriptions, SEND_CONCURRENCY)) {
      const outcomes = await Promise.allSettled(group.map(deliver))

      for (const outcome of outcomes) {
        if (outcome.status === 'rejected') {
          // A throw from the sender or from pruning still has to land in a
          // terminal row: the scheduler swallows rejections and re-arms tomorrow,
          // so an unrecorded miss is silent.
          failures.push(describeThrown(outcome.reason))
          continue
        }

        const delivery = outcome.value

        if (delivery === 'sent') {
          sent += 1
        } else if (delivery !== 'pruned') {
          failures.push(delivery.failed)
        }
      }
    }
  } catch (error) {
    return record('FAILED', sent, describeThrown(error))
  }

  // Every subscription was stale, so pruning left the user with nothing to
  // deliver to: that is the same situation as never having subscribed.
  if (sent === 0 && failures.length === 0) {
    return record('SKIPPED_NO_SUBSCRIPTION')
  }

  return record(
    sent > 0 ? 'SENT' : 'FAILED',
    sent,
    sent > 0 ? null : failures.join('; ') || null,
  )
}

export const evaluateMorningReminderForAllUsers = async (
  db: Kysely<Database>,
  deps: Omit<MorningReminderDeps, 'userId'>,
): Promise<MorningReminderResult[]> => {
  const users = await db
    .selectFrom('users')
    .select('id')
    .orderBy('id', 'asc')
    .execute()

  const results: MorningReminderResult[] = []
  for (const user of users) {
    results.push(
      await evaluateMorningReminder(db, { ...deps, userId: user.id }),
    )
  }

  return results
}
