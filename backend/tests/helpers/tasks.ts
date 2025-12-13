import { executeGraphQL, type YogaApp } from './graphql.ts'
import { graphql } from '../gql/gql.ts'

const CreateTaskMutation = graphql(`
  mutation CreateTaskMutation($title: String!, $icon: String) {
    createTask(title: $title, icon: $icon) {
      taskEdge {
        node {
          id
          title
          icon
        }
      }
    }
  }
`)

interface CreateTaskArgs {
  title: string
  icon?: string | null
  yoga: YogaApp
  userToken: string
}

export const createTask = async ({
  title,
  icon,
  yoga,
  userToken,
}: CreateTaskArgs) => {
  return await executeGraphQL(
    CreateTaskMutation,
    { title, icon },
    { yoga, userToken },
  )
}
