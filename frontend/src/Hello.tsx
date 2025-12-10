import { graphql, useLazyLoadQuery } from 'react-relay'
import type { HelloMyCoolQuery } from './__generated__/HelloMyCoolQuery.graphql'

export const Hello = () => {
  const data = useLazyLoadQuery<HelloMyCoolQuery>(
    graphql`
      query HelloMyCoolQuery {
        hello
        me {
          id
        }
      }
    `,
    {},
  )

  return (
    <div>
      <div>{data.me.id}</div>
    </div>
  )
}
