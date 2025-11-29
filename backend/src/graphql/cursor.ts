import { Buffer } from 'node:buffer'

export type CursorFields = Record<string, string | number | null>

export const encodeBaseCursor = <T>(fields: T): string => {
  return Buffer.from(JSON.stringify(fields)).toString('base64url')
}

export const decodeBaseCursor = <T>(cursor: string): T => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'))
  } catch {
    throw new Error('Invalid cursor')
  }
}

// Factory to create type-safe encoder/decoder pairs
export function createCursorCodec<T>() {
  return {
    encode: (fields: T): string => encodeBaseCursor(fields),
    decode: (cursor: string): T => decodeBaseCursor<T>(cursor),
  }
}
