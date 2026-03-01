import type { Meta, StoryObj } from '@storybook/react-vite'

import { RoutineSlotItem } from '../../WeeklyPlan/RoutineSlotItem'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { Suspense } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import type { RoutineSlotItemStoryInnerQuery } from './__generated__/RoutineSlotItemStoryInnerQuery.graphql'

const RoutineSlotItemStoryInner = () => {
  const data = useLazyLoadQuery<RoutineSlotItemStoryInnerQuery>(
    graphql`
      query RoutineSlotItemStoryInnerQuery @relay_test_operation {
        node(id: "test_id") {
          ... on Task {
            ...RoutineSlotItem
          }
        }
      }
    `,
    {},
  )

  if (!data.node) return null

  return <RoutineSlotItem task={data.node} />
}

const RoutineSlotItemStory = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op => {
    return MockPayloadGenerator.generate(op, {
      Task() {
        return {}
      },
    })
  })

  return (
    <Suspense fallback="Loading...">
      <RelayEnvironmentProvider environment={environment}>
        <RoutineSlotItemStoryInner />
      </RelayEnvironmentProvider>
    </Suspense>
  )
}

const meta = {
  title: 'Components/RoutineSlotItem',
  component: RoutineSlotItemStory,
  parameters: {},
} satisfies Meta<typeof RoutineSlotItemStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
