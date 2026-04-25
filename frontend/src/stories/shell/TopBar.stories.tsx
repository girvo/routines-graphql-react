import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus, Filter } from 'lucide-react'
import { Button } from '../../primitives/Button'
import { TopBar } from '../../shell/TopBar'

const meta = {
  title: 'Shell/TopBar',
  component: TopBar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

const onLogout = () => {}

export const TitleOnly: Story = {
  args: { title: 'All tasks', onLogout },
}

export const WithSubtitle: Story = {
  args: { title: 'Today', subtitle: 'Wednesday, April 22', onLogout },
}

export const WithActions: Story = {
  args: {
    title: 'All tasks',
    onLogout,
    actions: (
      <Button variant="primary" leadingIcon={Plus} size="sm">
        New task
      </Button>
    ),
  },
}

export const WithMultipleActions: Story = {
  args: {
    title: 'Today',
    subtitle: 'Wednesday, April 22',
    onLogout,
    actions: (
      <>
        <Button variant="ghost" leadingIcon={Filter} size="sm">
          Filter
        </Button>
        <Button variant="primary" leadingIcon={Plus} size="sm">
          New task
        </Button>
      </>
    ),
  },
}
