import {
  tableToDomain,
  buildPositionedRoutineSlotEdge,
} from './routine-slot-domain.ts'
import type {
  MutationResolvers,
  MoveRoutineSlotInput,
  SlotMoveDestination,
} from '../graphql/resolver-types.ts'
import { assertAuthenticated, type Context } from '../graphql/context.ts'
import { fromGlobalId, type GlobalId } from '../globalId.ts'
import type { DayOfWeek, DaySection } from '../database/types.ts'
import {
  changedPositions,
  computeMove,
  type RoutineSlotMoveTarget,
} from './routine-slot-repository.ts'
import { GraphQLError } from 'graphql'
import { compactSectionPositions } from './routine-slot-removal.ts'
import { SqliteError } from 'better-sqlite3'

const badUserInput = (message: string) =>
  new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } })

type RawMoveTarget =
  | { kind: 'top' }
  | { kind: 'bottom' }
  | { kind: 'before'; anchorId: GlobalId }
  | { kind: 'after'; anchorId: GlobalId }

const moveDestinationKind = (
  destination: SlotMoveDestination,
): 'top' | 'bottom' | null => {
  if (destination === 'TOP') {
    return 'top'
  }
  if (destination === 'BOTTOM') {
    return 'bottom'
  }
  return null
}

const selectMoveTarget = (input: MoveRoutineSlotInput): RawMoveTarget => {
  const targets: RawMoveTarget[] = []

  if (input.beforeRoutineSlotId != null) {
    targets.push({ kind: 'before', anchorId: input.beforeRoutineSlotId })
  }
  if (input.afterRoutineSlotId != null) {
    targets.push({ kind: 'after', anchorId: input.afterRoutineSlotId })
  }
  if (input.to != null) {
    const kind = moveDestinationKind(input.to)
    if (kind === null) {
      throw badUserInput(`Unknown move destination: ${input.to}`)
    }
    targets.push({ kind })
  }

  if (targets.length !== 1) {
    throw badUserInput(
      'Provide exactly one of beforeRoutineSlotId, afterRoutineSlotId or to',
    )
  }

  return targets[0]
}

const resolveMoveTarget = (
  input: MoveRoutineSlotInput,
  movedId: number,
): RoutineSlotMoveTarget => {
  const target = selectMoveTarget(input)

  if (target.kind === 'top' || target.kind === 'bottom') {
    return target
  }

  const anchorId = fromGlobalId(target.anchorId, 'RoutineSlot')
  if (anchorId === movedId) {
    throw badUserInput('A routine slot cannot be moved relative to itself')
  }

  return { kind: target.kind, anchorId }
}

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
        node: edge.node,
        cursor: edge.cursor,
      },
    }
  }

export const moveRoutineSlot: MutationResolvers<Context>['moveRoutineSlot'] =
  async (_parent, { input }, context) => {
    assertAuthenticated(context)

    const movedId = fromGlobalId(input.routineSlotId, 'RoutineSlot')
    const target = resolveMoveTarget(input, movedId)

    const moved = await context.routineRepo.transaction(async tx => {
      const slot = await tx.findByIdAndUserId(movedId, context.currentUser.id)
      if (!slot) {
        throw new GraphQLError('Routine slot not found')
      }

      const rows = await tx.listByDayAndSection(
        context.currentUser.id,
        slot.day_of_week,
        slot.section,
      )

      if (target.kind === 'before' || target.kind === 'after') {
        const anchor = await tx.findByIdAndUserId(
          target.anchorId,
          context.currentUser.id,
        )

        if (!anchor) {
          throw new GraphQLError('Routine slot not found')
        }

        if (
          anchor.day_of_week !== slot.day_of_week ||
          anchor.section !== slot.section
        ) {
          throw new GraphQLError(
            'Routine slot is not in the same day and section',
          )
        }
      }

      const order = computeMove(
        rows.map(row => row.id),
        movedId,
        target,
      )

      await tx.setPositions(changedPositions(rows, order))

      return {
        dayOfWeek: slot.day_of_week,
        section: slot.section,
        movedSlotRow: {
          ...slot,
          position: order.indexOf(movedId),
        },
      }
    })

    const edge = buildPositionedRoutineSlotEdge(
      tableToDomain(moved.movedSlotRow),
    )

    return {
      movedRoutineSlotEdge: {
        node: edge.node,
        cursor: edge.cursor,
      },
      section: { dayOfWeek: moved.dayOfWeek, section: moved.section },
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

      await compactSectionPositions(
        tx,
        context.currentUser.id,
        slot.day_of_week,
        slot.section,
      )
    })

    return {
      deletedId: routineSlotId,
    }
  }
