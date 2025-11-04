declare const __brand: unique symbol

type Brand<T, TBrand extends string> = T & { [__brand]: TBrand }

export type GlobalId = Brand<string, 'GlobalId'>

export function toGlobalId(type: string, id: number): GlobalId {
  return Buffer.from(`${type}:${id}`).toString('base64') as GlobalId
}

function decodeGlobalId(globalId: GlobalId): {
  type: string
  id: number
} {
  const decoded = Buffer.from(globalId, 'base64').toString('utf-8')
  const [type, idStr] = decoded.split(':')
  if (!type || !idStr) {
    throw new Error(`Invalid global ID format: ${globalId}`)
  }
  const id = parseInt(idStr, 10)
  if (isNaN(id)) {
    throw new Error(`Invalid ID in global ID: ${idStr}`)
  }
  return { type, id }
}

export function fromGlobalId(globalId: GlobalId, expectedType: string): number {
  const { type, id } = decodeGlobalId(globalId)
  if (type !== expectedType) {
    throw new Error(`Expected global ID of type ${expectedType}, got ${type}`)
  }
  return id
}

export function asGlobalId(id: string): GlobalId {
  return id as GlobalId
}
