import { vi } from 'vitest'
import * as timeModule from '../../src/database/time.ts'

export function mockCurrentTime(date: Date | string) {
  const mockDate = typeof date === 'string' ? new Date(date) : date
  vi.spyOn(timeModule, 'getCurrentTimestamp').mockReturnValue(
    mockDate.toISOString(),
  )
}

export function restoreCurrentTime() {
  vi.restoreAllMocks()
}
