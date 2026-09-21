import type { Meta, StoryObj } from '@storybook/react-vite'
import type { OperationDescriptor } from 'relay-runtime'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'

import { DaySection } from './DaySection'
import { useDaySectionMoveTask } from './DaySectionMoveTask'
import type { DaySectionStoryQuery } from './__generated__/DaySectionStoryQuery.graphql'

const CONTAINER_ID = 'day-section-slots-monday-morning'

interface MockSlot {
  id: string
  taskId: string
  title: string
}

const PUSHUPS: MockSlot = {
  id: 'routine-slot-pushups',
  taskId: 'task-pushups',
  title: 'Pushups',
}
const SQUATS: MockSlot = {
  id: 'routine-slot-squats',
  taskId: 'task-squats',
  title: 'Squats',
}
const PLANKS: MockSlot = {
  id: 'routine-slot-planks',
  taskId: 'task-planks',
  title: 'Planks',
}

const READ_ORDER: MockSlot[] = [PUSHUPS, SQUATS, PLANKS]
const SETTLED_ORDER: MockSlot[] = [SQUATS, PLANKS, PUSHUPS]
const TITLES = ['Pushups', 'Squats', 'Planks']

/**
 * Both operations must resolve the same `DaySectionSlots.id`: that is what makes
 * the payload's `section { ...DaySection_section }` write land on the container
 * the page query read. The index counters track one operation at a time, and the
 * payload generates `movedRoutineSlotEdge` before `slots`.
 */
const generateDaySection = (
  operation: OperationDescriptor,
  nodes: MockSlot[],
  edgeCount: number,
) => {
  let edgeIndex = 0
  let nodeIndex = 0
  let currentNode = nodes[0]

  return MockPayloadGenerator.generate(operation, {
    DaySectionSlots: () => ({
      id: CONTAINER_ID,
      dayOfWeek: 'MONDAY',
      section: 'MORNING',
    }),
    RoutineSlotConnection: () => ({
      edges: Array.from({ length: edgeCount }, () => ({})),
    }),
    RoutineSlotEdge: () => ({ cursor: `cursor-${edgeIndex++}` }),
    RoutineSlot() {
      currentNode = nodes[nodeIndex++]
      return {
        id: currentNode.id,
        dayOfWeek: 'MONDAY',
        section: 'MORNING',
        position: nodeIndex,
      }
    },
    Task: () => ({
      id: currentNode.taskId,
      title: currentNode.title,
      icon: 'dumbbell',
    }),
    PageInfo: () => ({ endCursor: null, hasNextPage: false }),
  })
}

const createEnvironment = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    generateDaySection(op, READ_ORDER, READ_ORDER.length),
  )
  environment.mock.queueOperationResolver(op =>
    generateDaySection(op, [PUSHUPS, ...SETTLED_ORDER], SETTLED_ORDER.length),
  )

  return environment
}

const DaySectionStoryInner = () => {
  const data = useLazyLoadQuery<DaySectionStoryQuery>(
    graphql`
      query DaySectionStoryQuery @relay_test_operation {
        daySectionSlots(dayOfWeek: MONDAY, section: MORNING) {
          ...DaySection_section
        }
      }
    `,
    {},
  )

  return (
    <DaySection
      label="Morning"
      section={data.daySectionSlots}
      dayOfWeek="MONDAY"
      daySection="MORNING"
      queryRef={null}
      onButtonHover={() => {}}
    />
  )
}

const StoryMoveTrigger = () => {
  const [commitMove] = useDaySectionMoveTask()

  return (
    <button
      type="button"
      onClick={() =>
        commitMove({
          variables: {
            input: { routineSlotId: PUSHUPS.id, to: 'BOTTOM' },
          },
        })
      }
    >
      Move Pushups to bottom
    </button>
  )
}

const DaySectionStory = () => {
  const [environment] = useState(createEnvironment)

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <DaySectionStoryInner />
        <StoryMoveTrigger />
      </Suspense>
    </RelayEnvironmentProvider>
  )
}

const meta = {
  title: 'WeeklyPlan/DaySection',
  component: DaySectionStory,
  parameters: {},
} satisfies Meta<typeof DaySectionStory>

export default meta
type Story = StoryObj<typeof meta>

const titlesInOrder = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('span')]
    .map(span => span.textContent)
    .filter((text): text is string => !!text && TITLES.includes(text))

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await canvas.findByText('Pushups')
    expect(titlesInOrder(canvasElement)).toEqual(TITLES)

    await userEvent.click(
      canvas.getByRole('button', { name: /move pushups to bottom/i }),
    )

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual([
        'Squats',
        'Planks',
        'Pushups',
      ])
    })
  },
}
