import type { DayOfWeek, DaySection } from '../database/types.ts'
import {
  changedPositions,
  type RoutineSlotTransaction,
} from './routine-slot-repository.ts'

export const compactSectionPositions = async (
  tx: RoutineSlotTransaction,
  userId: number,
  dayOfWeek: DayOfWeek,
  section: DaySection,
) => {
  const remaining = await tx.listByDayAndSection(userId, dayOfWeek, section)
  await tx.setPositions(
    changedPositions(
      remaining,
      remaining.map(row => row.id),
    ),
  )
}

export const removeSlotsOfTask = async (
  tx: RoutineSlotTransaction,
  taskId: number,
  userId: number,
) => {
  const slots = await tx.listByTaskIdAndUserId(taskId, userId)
  const scopes = new Map<
    string,
    { dayOfWeek: DayOfWeek; section: DaySection }
  >()

  for (const slot of slots) {
    await tx.deleteRoutineSlot(slot.id, userId)
    scopes.set(`${slot.day_of_week}:${slot.section}`, {
      dayOfWeek: slot.day_of_week,
      section: slot.section,
    })
  }

  for (const { dayOfWeek, section } of scopes.values()) {
    await compactSectionPositions(tx, userId, dayOfWeek, section)
  }
}
