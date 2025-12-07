import { tableToDomain, buildRoutineSlotEdge } from './routine-domain.ts'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { fromGlobalId } from '../globalId.ts'
import type { DayOfWeek, DaySection } from '../database/types.ts'

export const createRoutineSlot: MutationResolvers<Context>['createRoutineSlot'] =
  async (_parent, { input }, context) => {
    assertAuthenticated(context)

    const taskId = fromGlobalId(input.taskId, 'Task')

    const routineSlotRow = await context.routineRepo.createRoutineSlot(
      context.currentUser.id,
      taskId,
      input.dayOfWeek as DayOfWeek,
      input.section as DaySection,
    )
    const routineSlot = tableToDomain(routineSlotRow)

    return {
      routineSlotEdge: buildRoutineSlotEdge(routineSlot),
    }
  }

export const deleteRoutineSlot: MutationResolvers<Context>['deleteRoutineSlot'] =
  async (_parent, { routineSlotId }, context) => {
    assertAuthenticated(context)

    const id = fromGlobalId(routineSlotId, 'RoutineSlot')
    await context.routineRepo.deleteRoutineSlot(id, context.currentUser.id)

    return {
      deletedId: routineSlotId,
    }
  }
