export type MoveCommand = 'up' | 'down' | 'top' | 'bottom'

export type MoveTarget =
  | { to: 'TOP' | 'BOTTOM' }
  | { beforeRoutineSlotId: string }
  | { afterRoutineSlotId: string }

export type DropRelation = 'before' | 'after'

export const moveTargetForCommand = (
  slotIds: readonly string[],
  movedId: string,
  command: MoveCommand,
): MoveTarget | null => {
  const index = slotIds.indexOf(movedId)
  if (index === -1) return null

  switch (command) {
    case 'up':
      if (index === 0) return null
      if (index === 1) return { to: 'TOP' }
      return { beforeRoutineSlotId: slotIds[index - 1] }
    case 'down':
      if (index === slotIds.length - 1) return null
      if (index === slotIds.length - 2) return { to: 'BOTTOM' }
      return { afterRoutineSlotId: slotIds[index + 1] }
    case 'top':
      return index === 0 ? null : { to: 'TOP' }
    case 'bottom':
      return index === slotIds.length - 1 ? null : { to: 'BOTTOM' }
  }
}

export const moveTargetForDrop = (
  slotIds: readonly string[],
  movedId: string,
  relation: DropRelation,
  anchorIndex: number,
): MoveTarget | null => {
  const index = slotIds.indexOf(movedId)
  if (index === -1) return null
  if (!Number.isInteger(anchorIndex)) return null
  if (anchorIndex < 0 || anchorIndex >= slotIds.length) return null
  if (anchorIndex === index) return null
  if (relation === 'before' && anchorIndex === index + 1) return null
  if (relation === 'after' && anchorIndex === index - 1) return null

  if (relation === 'before') {
    return anchorIndex === 0
      ? { to: 'TOP' }
      : { beforeRoutineSlotId: slotIds[anchorIndex] }
  }
  return anchorIndex === slotIds.length - 1
    ? { to: 'BOTTOM' }
    : { afterRoutineSlotId: slotIds[anchorIndex] }
}

export const applyMove = (
  slotIds: readonly string[],
  movedId: string,
  target: MoveTarget,
): string[] => {
  if (!slotIds.includes(movedId)) return [...slotIds]

  const rest = slotIds.filter(id => id !== movedId)

  if ('to' in target) {
    return target.to === 'TOP' ? [movedId, ...rest] : [...rest, movedId]
  }

  const anchorId =
    'beforeRoutineSlotId' in target
      ? target.beforeRoutineSlotId
      : target.afterRoutineSlotId

  const anchorIndex = rest.indexOf(anchorId)
  if (anchorIndex === -1) return [...slotIds]

  const insertAt =
    'beforeRoutineSlotId' in target ? anchorIndex : anchorIndex + 1
  return [...rest.slice(0, insertAt), movedId, ...rest.slice(insertAt)]
}
