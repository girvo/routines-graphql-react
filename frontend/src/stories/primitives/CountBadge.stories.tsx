import type { Meta, StoryObj } from '@storybook/react-vite'
import { CountBadge } from '../../primitives/CountBadge'

const meta = {
  title: 'Primitives/CountBadge',
  component: CountBadge,
} satisfies Meta<typeof CountBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { count: 6 },
}

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <CountBadge count={1} />
      <CountBadge count={6} />
      <CountBadge count={42} />
      <CountBadge count={128} />
    </div>
  ),
}
