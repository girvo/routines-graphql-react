import type { Meta, StoryObj } from '@storybook/react-vite'
import { DesktopSidebar } from '../../shell/DesktopSidebar'

const meta = {
  title: 'Shell/DesktopSidebar',
  component: DesktopSidebar,
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, background: '#ffffff' }} />
      </div>
    ),
  ],
} satisfies Meta<typeof DesktopSidebar>

export default meta
type Story = StoryObj<typeof meta>

const user = { name: 'Josh G.', email: 'josh@jgirvin.com', initials: 'JG' }

export const Today: Story = {
  args: { user, onLogout: () => {} },
}

export const Weekly: Story = {
  args: { user, onLogout: () => {} },
  parameters: { currentPath: '/weekly' },
}

export const Tasks: Story = {
  args: { user, onLogout: () => {} },
  parameters: { currentPath: '/tasks' },
}

export const SettingsActive: Story = {
  args: { user, onLogout: () => {} },
  parameters: { currentPath: '/settings' },
}
