import type { Meta, StoryObj } from '@storybook/react-vite'
// import { mocked } from 'storybook/test'
// import { useMatches } from 'react-router'

import { AppShell } from '../AppShell'

const meta = {
  title: 'Components/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    pageTitle: 'Today',
  },
}
export const AllTasks: Story = {
  parameters: {
    currentPath: '/tasks',
    pageTitle: 'All tasks',
  },
}
