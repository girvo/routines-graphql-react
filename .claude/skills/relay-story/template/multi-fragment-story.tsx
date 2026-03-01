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
            __typename
            ...FRAGMENT_NAME_1
            ...FRAGMENT_NAME_2
          }
        }
      }
    `,
    {},
  )

  if (!data.node) return null
  if (data.node.__typename !== 'GRAPHQL_TYPE') return null

  return (
    <COMPONENT_NAME
      FRAGMENT_PROP_1={data.node}
      FRAGMENT_PROP_2={data.node}
      OTHER_PROP=""
    />
  )
}

const COMPONENT_NAMEStory = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op => {
    return MockPayloadGenerator.generate(op, {
      GRAPHQL_TYPE() {
        return {}
      },
      GRAPHQL_CONNECTION_TYPE() {
        return {
          edges: [],
        }
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
