import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelayEnvironmentProvider } from 'react-relay'
import { loadQuery } from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'
import { Suspense } from 'react'

import { DesktopSidebar } from './DesktopSidebar'
import DesktopSidebarQueryNode from './__generated__/DesktopSidebarQuery.graphql'
import type { DesktopSidebarQuery } from './__generated__/DesktopSidebarQuery.graphql'

const renderer = () => {
  const environment = createMockEnvironment()
  environment.mock.queueOperationResolver((op) =>
    MockPayloadGenerator.generate(op, {
      User() {
        return {
          name: 'Josh G.',
          email: 'josh@jgirvin.com',
          initials: 'JG',
        }
      },
    }),
  )

  const user = loadQuery<DesktopSidebarQuery>(
    environment,
    DesktopSidebarQueryNode,
    {},
  )

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback="Loading...">
          <DesktopSidebar user={user} onLogout={() => {}} />
        </Suspense>
      </RelayEnvironmentProvider>
      <div style={{ flex: 1, background: '#ffffff' }} />
    </div>
  )
}

const meta = {
  title: 'Shell/DesktopSidebar',
  component: renderer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof renderer>

export default meta
type Story = StoryObj<typeof meta>

export const Today: Story = {}

export const Weekly: Story = {
  parameters: { currentPath: '/weekly' },
}

export const Tasks: Story = {
  parameters: { currentPath: '/tasks' },
}
