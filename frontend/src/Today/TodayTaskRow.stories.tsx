import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'

import { TodayTaskRow } from './TodayTaskRow'
import type { TodayTaskRowStoryInnerQuery } from './__generated__/TodayTaskRowStoryInnerQuery.graphql'

const createEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      DailyTaskInstance() {
        return {
          id: 'daily-task-instance-1',
          completion: null,
        }
      },
      RoutineSlot() {
        return {
          id: 'routine-slot-1',
        }
      },
      Task() {
        return {
          id: 'task-1',
          title: 'Pushups',
          icon: 'dumbbell',
        }
      },
    }),
  )

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      CompleteRoutineSlotPayload() {
        return {}
      },
      TaskCompletionEdge() {
        return {}
      },
      TaskCompletion() {
        return {
          id: 'task-completion-1',
          completedAt: '2026-01-01T00:00:00.000Z',
        }
      },
      DailyTaskInstance() {
        return {
          id: 'daily-task-instance-1',
        }
      },
    }),
  )

  return environment
}

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
  const [environment] = useState(createEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <TodayTaskRowStoryInner />
      </Suspense>
    </RelayEnvironmentProvider>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = await canvas.findByRole('checkbox', { name: /pushups/i })

    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)

    await waitFor(() => {
      expect(checkbox).toBeChecked()
    })
  },
}
