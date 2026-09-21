import { graphql, useMutation } from 'react-relay'
import type { DaySectionMoveTaskMutation } from './__generated__/DaySectionMoveTaskMutation.graphql.ts'

export const useDaySectionMoveTask = () =>
  useMutation<DaySectionMoveTaskMutation>(graphql`
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
