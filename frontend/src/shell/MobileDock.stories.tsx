import type { Meta, StoryObj } from '@storybook/react-vite'
import { MobileDock } from './MobileDock'

const meta = {
  title: 'Shell/MobileDock',
  component: MobileDock,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ width: 390, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, background: '#ffffff' }} />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileDock>

export default meta
type Story = StoryObj<typeof meta>

export const Today: Story = {}

export const Weekly: Story = {
  parameters: { currentPath: '/weekly' },
}

export const Tasks: Story = {
  parameters: { currentPath: '/tasks' },
}
