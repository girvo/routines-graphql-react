import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, userEvent, expect, waitFor } from 'storybook/test'

import { AddTaskDropdownContent } from './AddTaskDropdown'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { Suspense } from 'react'
import { RelayEnvironmentProvider, loadQuery } from 'react-relay'
import type { PreloadedQuery } from 'react-relay'
import type { AddTaskDropdownQuery } from './__generated__/AddTaskDropdownQuery.graphql'
import AddTaskDropdownQueryNode from './__generated__/AddTaskDropdownQuery.graphql'
import styles from './AddTaskDropdown.module.css'

const AddTaskDropdownStory = () => {
  const environment = createMockEnvironment()

  environment.mock.queueOperationResolver(op =>
    MockPayloadGenerator.generate(op, {
      TaskConnection() {
        return {
          edges: [{}, {}, {}],
        }
      },
    }),
  )

  environment.mock.queuePendingOperation(AddTaskDropdownQueryNode, {})

  const queryRef = loadQuery(
    environment,
    AddTaskDropdownQueryNode,
    {},
  ) as PreloadedQuery<AddTaskDropdownQuery>

  return (
    <Suspense fallback="Loading...">
      <RelayEnvironmentProvider environment={environment}>
        <div className={styles.content}>
          <AddTaskDropdownContent
            queryRef={queryRef}
            connectionId="test_connection"
            dayOfWeek="MONDAY"
            daySection="MORNING"
            onDone={() => {}}
          />
        </div>
      </RelayEnvironmentProvider>
    </Suspense>
  )
}

const meta = {
  title: 'WeeklyPlan/AddTaskDropdown',
  component: AddTaskDropdownStory,
  parameters: {},
} satisfies Meta<typeof AddTaskDropdownStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for the listbox to populate from the Relay mock
    const listbox = await canvas.findByRole('listbox')
    const list = within(listbox)
    const taskButtons = list.getAllByRole('option')

    // Focus the search input and press ArrowDown
    const searchInput = canvas.getByPlaceholderText('Search tasks...')
    searchInput.focus()
    await userEvent.keyboard('{ArrowDown}')

    // Assert: first option should be highlighted via aria-selected
    await waitFor(() => {
      expect(taskButtons[0]).toHaveAttribute('aria-selected', 'true')
    })
  },
}
