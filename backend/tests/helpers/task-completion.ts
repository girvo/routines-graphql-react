import { executeGraphQL, type YogaApp } from './graphql.ts'
import { graphql } from '../gql/gql.ts'
import type { GlobalId } from '../../src/globalId.ts'
import { fromGlobalId } from '../../src/globalId.ts'
import { encodeDailyTaskInstanceId } from '../../src/schedule/schedule-domain.ts'

export const dailyTaskInstanceIdFor = (
  routineSlotGlobalId: GlobalId,
  date: Date,
): GlobalId =>
  encodeDailyTaskInstanceId(fromGlobalId(routineSlotGlobalId, 'RoutineSlot'), date)

const CompleteRoutineSlotMutation = graphql(`
  mutation CompleteRoutineSlotHelper($dailyTaskInstanceId: ID!) {
    completeRoutineSlot(dailyTaskInstanceId: $dailyTaskInstanceId) {
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
  routineSlotId: GlobalId
  date?: Date
  yoga: YogaApp
  userToken: string
}

export const completeRoutineSlot = async ({
  routineSlotId,
  date = new Date(),
  yoga,
  userToken,
}: CompleteRoutineSlotArgs) => {
  return await executeGraphQL(
    CompleteRoutineSlotMutation,
    { dailyTaskInstanceId: dailyTaskInstanceIdFor(routineSlotId, date) },
    {
      yoga,
      userToken,
    },
  )
}
