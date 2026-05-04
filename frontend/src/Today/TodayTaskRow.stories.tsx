import type { Meta, StoryObj } from '@storybook/react-vite'

import { TodayTaskRow } from './TodayTaskRow'
import { ToastProvider } from '../toast/ToastProvider'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { Suspense } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import type { TodayTaskRowStoryInnerQuery } from './__generated__/TodayTaskRowStoryInnerQuery.graphql'

const TodayTaskRowStoryInner = () => {
  const data = useLazyLoadQuery<TodayTaskRowStoryInnerQuery>(
    graphql`
      query TodayTaskRowStoryInnerQuery @relay_test_operation {
        node(id: "test_id") {
          ... on DailyTaskInstance {
            ...TodayTaskRow_instance
          }
        }
      }
    `,
    {},
  )

  if (!data.node) return null

  return <TodayTaskRow instance={data.node} />
}

const TodayTaskRowStory = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op),
  )

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op),
  )

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op),
  )

  return (
    <Suspense fallback="Loading...">
      <RelayEnvironmentProvider environment={environment}>
        <ToastProvider>
          <TodayTaskRowStoryInner />
        </ToastProvider>
      </RelayEnvironmentProvider>
    </Suspense>
  )
}

const meta = {
  title: 'Today/TodayTaskRow',
  component: TodayTaskRowStory,
  parameters: {},
} satisfies Meta<typeof TodayTaskRowStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
