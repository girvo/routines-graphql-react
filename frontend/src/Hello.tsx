import { graphql, useLazyLoadQuery } from 'react-relay'
import type { HelloMyCoolQuery } from './__generated__/HelloMyCoolQuery.graphql'
import { useEffect, useState } from 'react'

export const Hello = () => {
  const [_, setReRenderTrigger] = useState(0) // Using '_' to indicate the value isn't directly used

  const forceReRender = () => {
    setReRenderTrigger(prev => prev + 1) // Update the state to trigger a re-render
  }
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

  useEffect(() => {
    console.log('re-rendered')
  })

  return (
    <div>
      <div>{data.me.id}</div>
      <a
        onClick={() => {
          console.log('test')
          forceReRender()
        }}
      >
        Re-render
      </a>
    </div>
  )
}
