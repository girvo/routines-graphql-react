export interface RateLimitDecision {
  allowed: boolean
  retryAfterSeconds: number
}

export interface RateLimiter {
  check: (key: string) => RateLimitDecision
  reset: () => void
}

/**
 * Fixed-window counter held in process memory. That is deliberately the whole
 * design: the server is a single Node process with one container, so a
 * distributed store would buy nothing, and every caller we need to throttle
 * (test pushes) is already cheap to recount after a restart.
 */
export const createRateLimiter = (options: {
  limit: number
  windowMs: number
  now?: () => number
}): RateLimiter => {
  const { limit, windowMs } = options
  const now = options.now ?? Date.now
  const windows = new Map<string, { startsAt: number; count: number }>()

  return {
    check(key) {
      const instant = now()
      const window = windows.get(key)

      if (window === undefined || instant >= window.startsAt + windowMs) {
        windows.set(key, { startsAt: instant, count: 1 })
        return { allowed: true, retryAfterSeconds: 0 }
      }

      if (window.count >= limit) {
        const retryAfterMs = window.startsAt + windowMs - instant

        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
        }
      }

      window.count += 1

      return { allowed: true, retryAfterSeconds: 0 }
    },
    reset() {
      windows.clear()
    },
  }
}

/**
 * `sendTestPush` dials an endpoint we stored, so it is both the one mutation
 * that makes an outbound request on behalf of a caller and the one a user is
 * likely to tap repeatedly while setting a phone up.
 */
export const testPushRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 60_000,
})
