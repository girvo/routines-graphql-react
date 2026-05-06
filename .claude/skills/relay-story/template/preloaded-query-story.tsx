import type { Meta, StoryObj } from '@storybook/react-vite'

import { COMPONENT_NAME } from './COMPONENT_NAME'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { Suspense } from 'react'
import {
  RelayEnvironmentProvider,
  loadQuery,
} from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import type { QUERY_TYPE } from './__generated__/QUERY_FILE.graphql'
import QUERY_NODE from './__generated__/QUERY_FILE.graphql'

const COMPONENT_NAMEStory = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op),
  )

  // If the component has mutations, queue additional resolvers (one per mutation):
  // environment.mock.queueOperationResolver(op =>
  //   MockPayloadGenerator.generate(op),
  // )

  environment.mock.queuePendingOperation(
    QUERY_NODE,
    {},
  )

  const queryRef = loadQuery(
    environment,
    QUERY_NODE,
    {},
  ) as PreloadedQuery<QUERY_TYPE>

  return (
    <Suspense fallback="Loading...">
      <RelayEnvironmentProvider environment={environment}>
        <COMPONENT_NAME
          QUERY_PROP={queryRef}
          OTHER_PROP=""
        />
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