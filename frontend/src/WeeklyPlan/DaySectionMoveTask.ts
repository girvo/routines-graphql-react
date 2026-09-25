import { graphql, useMutation } from 'react-relay'
import { reorderConnectionEdges } from '../relay/reorder-connection-edges.ts'
import { useMutationErrorHandler } from '../relay/use-mutation-error-handler.ts'
import { applyMove, type MoveTarget } from './task-order.ts'
import type { DaySectionMoveTaskMutation } from './__generated__/DaySectionMoveTaskMutation.graphql.ts'

export interface DaySectionMove {
  slotIds: readonly string[]
  isMoving: boolean
  moveSlot: (routineSlotId: string, target: MoveTarget) => void
}

interface DaySectionMoveTaskOptions {
  connectionId: string
  slotIds: readonly string[]
}

export const useDaySectionMoveTask = ({
  connectionId,
  slotIds,
}: DaySectionMoveTaskOptions) => {
  const { showPayloadErrors, showError } = useMutationErrorHandler()
  const [commit, isMoving] = useMutation<DaySectionMoveTaskMutation>(graphql`
    mutation DaySectionMoveTaskMutation($input: MoveRoutineSlotInput!) {
      moveRoutineSlot(input: $input) {
        section {
          ...DaySection_section
        }
      }
    }
  `)

  const moveSlot = (routineSlotId: string, target: MoveTarget) => {
    return commit({
      variables: { input: { routineSlotId, ...target } },
      optimisticUpdater: reorderConnectionEdges(
        connectionId,
        applyMove(slotIds, routineSlotId, target),
      ),
      onCompleted: (_response, errors) => {
        showPayloadErrors(errors)
      },
      onError: showError,
    })
  }

  return { moveSlot, isMoving }
}
