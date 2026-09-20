import { fromZonedTime } from 'date-fns-tz'
import { USER_TIMEZONE, getUserDayKey } from '../user-timezone.ts'

export const MORNING_REMINDER_HOUR = 9

export interface ReminderSchedulerLog {
  info: (message: string) => void
  error: (error: unknown, message: string) => void
}

export interface ReminderSchedulerOptions {
  onFire: (fireTime: Date) => Promise<unknown>
  log: ReminderSchedulerLog
  now?: () => Date
}

const fireTimeForDayKey = (dayKey: string): Date =>
  fromZonedTime(
    `${dayKey}T${String(MORNING_REMINDER_HOUR).padStart(2, '0')}:00:00.000`,
    USER_TIMEZONE,
  )

/**
 * Increments a `yyyy-MM-dd` key with pure UTC arithmetic, so the result never
 * depends on the host timezone or its DST rules.
 */
const nextDayKey = (dayKey: string): string => {
  const [year, month, day] = dayKey.split('-').map(Number)

  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10)
}

/**
 * Strictly future fire time: at or past 09:00 Brisbane the answer is tomorrow,
 * which is why a restart across 09:00 simply loses that day's reminder.
 */
export const computeNextReminderFireTime = (now: Date): Date => {
  const todaysFire = fireTimeForDayKey(getUserDayKey(now))

  if (now < todaysFire) {
    return todaysFire
  }

  return fireTimeForDayKey(nextDayKey(getUserDayKey(now)))
}

/**
 * One timer at a time: sleep until the next 09:00, run, then arm the following
 * day. There is deliberately no catch-up send for misses while the process was
 * down; `reminder:run` covers manual sends.
 */
export const startMorningReminderScheduler = ({
  onFire,
  log,
  now = () => new Date(),
}: ReminderSchedulerOptions) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopped = false
  let inFlight: Promise<void> | null = null

  const schedule = () => {
    if (stopped) return

    const current = now()
    const fireTime = computeNextReminderFireTime(current)
    const delay = Math.max(0, fireTime.getTime() - current.getTime())

    log.info(
      `Morning reminder scheduled for ${fireTime.toISOString()} (in ${Math.round(
        delay / 1000,
      )}s)`,
    )

    timer = setTimeout(() => {
      timer = undefined
      inFlight = (async () => {
        try {
          await onFire(fireTime)
        } catch (error) {
          log.error(error, 'Morning reminder run failed')
        } finally {
          schedule()
        }
      })()
    }, delay)
  }

  schedule()

  return {
    /**
     * Resolves once any run that already started has settled. Exiting while a
     * send is in flight leaves that day's delivery row `PENDING` and the
     * notification undelivered, with nothing to tell an operator.
     */
    stop: async () => {
      stopped = true
      if (timer !== undefined) {
        clearTimeout(timer)
        timer = undefined
      }

      await inFlight
    },
  }
}
