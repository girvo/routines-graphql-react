import {
  tableToDomain,
  buildPositionedRoutineSlotEdge,
  routineSlotToGraphQL,
} from './routine-slot-domain.ts'
import type { MutationResolvers } from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { fromGlobalId } from '../globalId.ts'
import type { DayOfWeek, DaySection } from '../database/types.ts'
import type { RoutineSlotPositionEntry } from './routine-slot-repository.ts'
import { GraphQLError } from 'graphql'
import { SqliteError } from 'better-sqlite3'

export const createRoutineSlot: MutationResolvers<Context>['createRoutineSlot'] =
  async (_parent, { input }, context) => {
    assertAuthenticated(context)

    const taskId = fromGlobalId(input.taskId, 'Task')
    const dayOfWeek = input.dayOfWeek as DayOfWeek
    const section = input.section as DaySection

    const task = await context.taskRepo.findByIdAndUserId(
      taskId,
      context.currentUser.id,
    )
    if (!task) {
      throw new GraphQLError('Task not found')
    }

    const routineSlotRow = await context.routineRepo.transaction(async tx => {
      const existing = await tx.findByUniqueKey(
        context.currentUser.id,
        taskId,
        dayOfWeek,
        section,
      )

      if (existing && existing.deleted_at === null) {
        throw new GraphQLError(
          'This task is already scheduled for this time slot',
        )
      }

      const position = await tx.nextPositionForDayAndSection(
        context.currentUser.id,
        dayOfWeek,
        section,
      )

      if (existing) {
        return tx.reviveRoutineSlotWithPosition(existing.id, position)
      }

      try {
        return await tx.insertWithPosition(
          context.currentUser.id,
          taskId,
          dayOfWeek,
          section,
          position,
        )
      } catch (error) {
        if (
          error instanceof SqliteError &&
          error.code === 'SQLITE_CONSTRAINT_UNIQUE'
        ) {
          throw new GraphQLError(
            'This task is already scheduled for this time slot',
          )
        }
        throw error
      }
    })

    const routineSlot = tableToDomain(routineSlotRow)
    const edge = buildPositionedRoutineSlotEdge(routineSlot)

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

    await context.routineRepo.transaction(async tx => {
      const slot = await tx.findByIdAndUserId(id, context.currentUser.id)
      if (!slot) {
        throw new GraphQLError('Routine slot not found')
      }

      const result = await tx.deleteRoutineSlot(id, context.currentUser.id)
      if (result.numUpdatedRows < 1n) {
        throw new GraphQLError('Routine slot not found')
      }

      const survivors = await tx.listByDayAndSection(
        context.currentUser.id,
        slot.day_of_week,
        slot.section,
      )
      const renumbered: RoutineSlotPositionEntry[] = []
      survivors.forEach((row, index) => {
        if (row.position !== index) {
          renumbered.push({ id: row.id, position: index })
        }
      })
      await tx.setPositions(renumbered)
    })

    return {
      deletedId: routineSlotId,
    }
  }
