declare const __brand: unique symbol

type Brand<T, TBrand extends string> = T & { [__brand]: TBrand }

export type GlobalId = Brand<string, 'GlobalId'>

export function encodeGlobalId(type: string, payload: string): GlobalId {
  return Buffer.from(`${type}:${payload}`).toString('base64') as GlobalId
}

export function toGlobalId(type: string, id: number): GlobalId {
  return encodeGlobalId(type, String(id))
}

export function decodeGlobalId(globalId: GlobalId): {
  type: string
  payload: string
} {
  const decoded = Buffer.from(globalId, 'base64').toString('utf-8')
  const colonIndex = decoded.indexOf(':')
  if (colonIndex < 1 || colonIndex === decoded.length - 1) {
    throw new Error(`Invalid global ID format: ${globalId}`)
  }

  return {
    type: decoded.slice(0, colonIndex),
    payload: decoded.slice(colonIndex + 1),
  }
}

export function fromGlobalId(globalId: GlobalId, expectedType: string): number {
  const { type, payload } = decodeGlobalId(globalId)
  if (type !== expectedType) {
    throw new Error(`Expected global ID of type ${expectedType}, got ${type}`)
  }

  const id = parseInt(payload, 10)
  if (isNaN(id)) {
    throw new Error(`Invalid integer ID in global ID payload: ${payload}`)
  }

  return id
}

export function asGlobalId(id: string): GlobalId {
  return id as GlobalId
}
