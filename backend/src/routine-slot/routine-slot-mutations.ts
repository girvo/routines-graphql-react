import {
  tableToDomain,
  buildRoutineSlotEdge,
  routineSlotToGraphQL,
} from './routine-slot-domain.ts'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { fromGlobalId } from '../globalId.ts'
import type { DayOfWeek, DaySection } from '../database/types.ts'
import { GraphQLError } from 'graphql'
import { SqliteError } from 'better-sqlite3'

export const createRoutineSlot: MutationResolvers<Context>['createRoutineSlot'] =
  async (_parent, { input }, context) => {
    assertAuthenticated(context)

    const taskId = fromGlobalId(input.taskId, 'Task')
    const dayOfWeek = input.dayOfWeek as DayOfWeek
    const section = input.section as DaySection

    const task = await context.taskRepo.findByIdAndUserId(taskId, context.currentUser.id)
    if (!task) {
      throw new GraphQLError('Task not found')
    }

    const existing = await context.routineRepo.findByUniqueKey(
      context.currentUser.id,
      taskId,
      dayOfWeek,
      section,
    )

    let routineSlotRow
    if (existing && existing.deleted_at === null) {
      throw new GraphQLError('This task is already scheduled for this time slot')
    } else if (existing) {
      routineSlotRow = await context.routineRepo.reviveRoutineSlot(existing.id)
    } else {
      try {
        routineSlotRow = await context.routineRepo.createRoutineSlot(
          context.currentUser.id,
          taskId,
          dayOfWeek,
          section,
        )
      } catch (error) {
        if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          throw new GraphQLError('This task is already scheduled for this time slot')
        }
        throw error
      }
    }

    const routineSlot = tableToDomain(routineSlotRow)
    const edge = buildRoutineSlotEdge(routineSlot)

    return {
      routineSlotEdge: {
        node: routineSlotToGraphQL(edge.node),
        cursor: edge.cursor,
      },
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
