export const NOTIFICATION_TAG = 'morning-reminder'

export const NOTIFICATION_TITLE = 'Morning routine'

export const NOTIFICATION_BODY =
  'You have not ticked off any morning tasks today.'

export type PushNotificationPayload = {
  title: string
  body: string
  url: string
  tag: string
}

/**
 * Copy is fixed by design: there is exactly one reminder per day, so it carries
 * no counters or per-day state. `url` lands on the Today page for the Brisbane
 * day the reminder was evaluated for.
 */
export const buildMorningReminderPayload = (
  dayKey: string,
): PushNotificationPayload => ({
  title: NOTIFICATION_TITLE,
  body: NOTIFICATION_BODY,
  url: `/?date=${dayKey}`,
  tag: NOTIFICATION_TAG,
})
