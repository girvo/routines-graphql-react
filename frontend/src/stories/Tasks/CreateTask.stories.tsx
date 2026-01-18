import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayEnvironmentProvider } from 'react-relay'
import { createMockEnvironment } from 'relay-test-utils'
import { Suspense } from 'react'

import { CreateTask } from '../../Tasks/CreateTask'

const renderer = () => {
  const environment = createMockEnvironment()

  return (
    <div className="max-w-200">
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback="Loading...">
          <table className="table">
            <tbody>
              <CreateTask
                connectionId="mock-connection-id"
                setIsCreating={() => {
                  console.log('setIsCreating called')
                }}
              />
            </tbody>
          </table>
        </Suspense>
      </RelayEnvironmentProvider>
    </div>
  )
}

const meta = {
  title: 'Tasks/CreateTask',
  component: renderer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof renderer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
