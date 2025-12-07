import { executeGraphQL, type YogaApp } from './graphql.ts'
import { graphql } from '../gql/gql.ts'
import type { CreateRoutineSlotInput } from '../gql/graphql.ts'

/**
 * Extracted this out as lots of other tests will need to run it
 */
const CreateRoutineSlotMutation = graphql(`
  mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {
    createRoutineSlot(input: $input) {
      routineSlotEdge {
        node {
          id
          task {
            id
            title
          }
          dayOfWeek
          section
          createdAt
        }
        cursor
      }
    }
  }
`)

interface CreateRoutineSlotArgs {
  input: CreateRoutineSlotInput
  yoga: YogaApp
  userToken: string
}

export const createRoutineSlot = async ({
  input,
  yoga,
  userToken,
}: CreateRoutineSlotArgs) => {
  return await executeGraphQL(
    CreateRoutineSlotMutation,
    { input },
    {
      yoga,
      userToken,
    },
  )
}
