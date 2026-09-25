import type { Meta, StoryObj } from '@storybook/react-vite'
import { Suspense, useState } from 'react'
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from 'react-relay'
import { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils'

import { DesktopSidebar } from '../DesktopSidebar'
import type { DesktopSidebarStoryQuery } from './__generated__/DesktopSidebarStoryQuery.graphql'

const createEnvironment = () => {
  const environment = createMockEnvironment()
  environment.mock.queueOperationResolver(op =>
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
  return environment
}

const DesktopSidebarStoryInner = () => {
  const data = useLazyLoadQuery<DesktopSidebarStoryQuery>(
    graphql`
      query DesktopSidebarStoryQuery @relay_test_operation {
        me {
          ...DesktopSidebar_me
        }
      }
    `,
    {},
  )
  return <DesktopSidebar me={data.me} onLogout={() => {}} />
}

const DesktopSidebarStory = () => {
  const [environment] = useState(createEnvironment)

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback="Loading...">
          <DesktopSidebarStoryInner />
        </Suspense>
      </RelayEnvironmentProvider>
      <div style={{ flex: 1, background: '#ffffff' }} />
    </div>
  )
}

const meta = {
  title: 'Shell/DesktopSidebar',
  component: DesktopSidebarStory,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DesktopSidebarStory>

export default meta
type Story = StoryObj<typeof meta>

export const Today: Story = {}

export const Weekly: Story = {
  parameters: { currentPath: '/weekly' },
}

export const Tasks: Story = {
  parameters: { currentPath: '/tasks' },
}
