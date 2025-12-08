import { executeGraphQL, type YogaApp } from './graphql.ts'
import { graphql } from '../gql/gql.ts'

const CompleteRoutineSlotMutation = graphql(`
  mutation CompleteRoutineSlotHelper($routineSlotId: ID!) {
    completeRoutineSlot(routineSlotId: $routineSlotId) {
      taskCompletionEdge {
        node {
          id
          completedAt
          routineSlot {
            id
            dayOfWeek
            section
          }
        }
        cursor
      }
    }
  }
`)

interface CompleteRoutineSlotArgs {
  routineSlotId: string
  yoga: YogaApp
  userToken: string
}

export const completeRoutineSlot = async ({
  routineSlotId,
  yoga,
  userToken,
}: CompleteRoutineSlotArgs) => {
  return await executeGraphQL(
    CompleteRoutineSlotMutation,
    { routineSlotId },
    {
      yoga,
      userToken,
    },
  )
}
