import { vi } from 'vitest'

vi.mock('../src/database/index.ts', async () => {
  return {
    db: null,
  }
})
