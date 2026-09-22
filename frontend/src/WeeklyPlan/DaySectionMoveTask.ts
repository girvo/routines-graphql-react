import { graphql, useMutation, useRelayEnvironment } from 'react-relay'
import { composeUpdaters } from '../relay/compose-updaters.ts'
import { reorderConnectionEdgesOnce } from '../relay/reorder-connection-edges.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import { invalidateDailyRoutinesForDayOfWeek } from './invalidate-daily-routines.ts'
import { applyMove, type MoveTarget } from './task-order.ts'
import type { DayOfWeek } from './days.ts'
import type { DaySectionMoveTaskMutation } from './__generated__/DaySectionMoveTaskMutation.graphql.ts'

export interface DaySectionMove {
  slotIds: readonly string[]
  isMoving: boolean
  moveSlot: (routineSlotId: string, target: MoveTarget) => void
}

interface DaySectionMoveTaskOptions {
  connectionId: string
  slotIds: readonly string[]
  dayOfWeek: DayOfWeek
}

export const useDaySectionMoveTask = ({
  connectionId,
  slotIds,
  dayOfWeek,
}: DaySectionMoveTaskOptions) => {
  const environment = useRelayEnvironment()
  const { showPayloadErrors, showError } = useMutationErrorHandler()
  const [commit, isMoving] = useMutation<DaySectionMoveTaskMutation>(graphql`
    mutation DaySectionMoveTaskMutation($input: MoveRoutineSlotInput!) {
      moveRoutineSlot(input: $input) {
        movedRoutineSlotEdge {
          cursor
          node {
            id
            position
          }
        }
        section {
          ...DaySection_section
        }
      }
    }
  `)

  const moveSlot = (routineSlotId: string, target: MoveTarget) => {
    const reorder = reorderConnectionEdgesOnce(
      connectionId,
      applyMove(slotIds, routineSlotId, target),
    )

    return commit({
      variables: { input: { routineSlotId, ...target } },
      optimisticUpdater: reorder,
      updater: composeUpdaters(
        reorder,
        invalidateDailyRoutinesForDayOfWeek(environment, dayOfWeek),
      ),
      onCompleted: (_response, errors) => {
        showPayloadErrors(errors)
      },
      onError: showError,
    })
  }

  return { moveSlot, isMoving }
}
