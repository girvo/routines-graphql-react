#!/usr/bin/env node

import { db } from '../src/database/index.ts'
import {
  evaluateMorningReminder,
  evaluateMorningReminderForAllUsers,
} from '../src/push/morning-reminder.ts'
import { createPushSenderFromEnv } from '../src/push/push-sender.ts'

const usage =
  'Usage: reminder:run [--now <ISO>] [--force <user-id>]\n' +
  '  --now   evaluate as if it were this instant (default: now)\n' +
  '  --force re-evaluate one user/day even if that day already has a row'

const parseFlag = (argv: string[], flag: string): string | null => {
  const index = argv.indexOf(flag)

  return index === -1 ? null : (argv[index + 1] ?? '')
}

const parseNow = (value: string | null): Date => {
  if (value === null) return new Date()

  if (value === '') {
    console.error(
      'Error: --now requires an ISO timestamp, e.g. --now 2026-09-16T23:00:00Z',
    )
    process.exit(1)
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    console.error(`Error: --now is not a valid ISO timestamp: ${value}`)
    process.exit(1)
  }

  return parsed
}

const parseForceUserId = (value: string | null): number | null => {
  if (value === null) return null

  const userId = Number(value)
  if (!Number.isInteger(userId) || userId <= 0) {
    console.error(`Error: --force requires a numeric user id, got: ${value}`)
    console.error(usage)
    process.exit(1)
  }

  return userId
}

const run = async () => {
  const pushSender = createPushSenderFromEnv()

  if (!pushSender) {
    console.error(
      'Error: VAPID_PRIVATE_KEY is not configured. Run pnpm --filter @my-routines/backend vapid:keys first.',
    )
    process.exit(1)
  }

  const argv = process.argv.slice(2)
  const now = parseNow(parseFlag(argv, '--now'))
  const forceUserId = parseForceUserId(parseFlag(argv, '--force'))

  let results

  if (forceUserId === null) {
    results = await evaluateMorningReminderForAllUsers(db, { now, pushSender })
  } else {
    const user = await db
      .selectFrom('users')
      .select('id')
      .where('id', '=', forceUserId)
      .executeTakeFirst()

    if (!user) {
      console.error(`Error: no user with id ${forceUserId}`)
      process.exit(1)
    }

    results = [
      await evaluateMorningReminder(db, {
        now,
        pushSender,
        userId: forceUserId,
        force: true,
      }),
    ]
  }

  if (results.length === 0) {
    console.log('No users found; nothing to evaluate.')
    return
  }

  for (const result of results) {
    console.log(
      `user=${result.userId} day=${result.dayKey} status=${result.status} sent=${result.subscriptionsSent} attempts=${result.attempts}` +
        (result.alreadyRecorded
          ? ' (already recorded, no send performed)'
          : '') +
        (result.error ? ` error=${result.error}` : ''),
    )
  }
}

await run()
