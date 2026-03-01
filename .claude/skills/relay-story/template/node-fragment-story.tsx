import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMPONENT_NAME } from '../../DIR/COMPONENT_NAME'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { Suspense } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import type { COMPONENT_NAMEStoryInnerQuery } from './__generated__/COMPONENT_NAMEStoryInnerQuery.graphql'

const COMPONENT_NAMEStoryInner = () => {
  const data = useLazyLoadQuery<COMPONENT_NAMEStoryInnerQuery>(
    graphql`
      query COMPONENT_NAMEStoryInnerQuery @relay_test_operation {
        node(id: "test_id") {
          ... on GRAPHQL_TYPE {
            ...FRAGMENT_NAME
          }
        }
      }
    `,
    {},
  )

  if (!data.node) return null

  return <COMPONENT_NAME FRAGMENT_PROP={data.node} />
}

const COMPONENT_NAMEStory = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op => {
    return MockPayloadGenerator.generate(op, {
      GRAPHQL_TYPE() {
        return {}
      },
    })
  })

  return (
    <Suspense fallback="Loading...">
      <RelayEnvironmentProvider environment={environment}>
        <COMPONENT_NAMEStoryInner />
      </RelayEnvironmentProvider>
    </Suspense>
  )
}

const meta = {
  title: 'DIR/COMPONENT_NAME',
  component: COMPONENT_NAMEStory,
  parameters: {},
} satisfies Meta<typeof COMPONENT_NAMEStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
