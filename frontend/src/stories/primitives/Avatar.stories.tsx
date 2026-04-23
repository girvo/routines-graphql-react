import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../../primitives/Avatar'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = {
  args: { initials: 'JG' },
}

export const Empty: Story = {
  args: {},
}

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar initials="JG" />
      <Avatar initials="AB" />
      <Avatar initials="Y" />
      <Avatar />
    </div>
  ),
}
