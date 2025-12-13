import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { type TasksPageQuery } from './__generated__/TasksPageQuery.graphql'
import { Task } from './Task'

console.debug('I am loaded!')

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
    <div className="flex flex-col gap-2">
      {data.tasks.edges.map(({ node }) => {
        return <Task key={node.id} task={node} />
      })}
    </div>
  )
}

export default TasksPage
