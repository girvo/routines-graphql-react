import { executeGraphQL, type YogaApp } from './graphql.ts'
import { graphql } from '../gql/gql.ts'

/**
 * Extracted this out as lots of other tests will need to run it
 */
const CreateTaskMutation = graphql(`
  mutation CreateTaskMutation($title: String!) {
    createTask(title: $title) {
      taskEdge {
        node {
          id
          title
        }
      }
    }
  }
`)

interface CreateTaskArgs {
  title: string
  yoga: YogaApp
  userToken: string
}

export const createTask = async ({
  title,
  yoga,
  userToken,
}: CreateTaskArgs) => {
  return await executeGraphQL(
    CreateTaskMutation,
    { title },
    { yoga, userToken },
  )
}
