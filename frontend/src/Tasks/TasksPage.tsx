import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { Task } from './Task'

interface TaskPageProps {
  queries: {
    tasksPageQuery: PreloadedQuery<TasksPageQuery>
  }
}

const TasksPage = ({ queries }: TaskPageProps) => {
  const data = usePreloadedQuery<TasksPageQuery>(
    graphql`
      query TasksPageQuery {
        tasks {
          edges {
            node {
              id
              ...TaskDisplay
            }
          }
        }
      }
    `,
    queries.tasksPageQuery,
  )

  return (
    <ul className="list bg-base-200 rounded-box shadow-md">
      {data.tasks.edges.map(({ node }) => {
        return <Task key={node.id} task={node} />
      })}
    </ul>
  )
}

export default TasksPage
