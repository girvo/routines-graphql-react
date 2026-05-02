import type { Meta, StoryObj } from '@storybook/react-vite'
import { SlotBadge } from './SlotBadge'

const meta = {
  title: 'Primitives/Badge/SlotBadge',
  component: SlotBadge,
} satisfies Meta<typeof SlotBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Filled: Story = {
  args: { section: 'Morning', count: 5 },
}

export const Ghost: Story = {
  args: { section: 'Morning', count: 5, variant: 'ghost' },
}

export const Gallery: Story = {
  args: { section: 'Morning', count: 0 },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <SlotBadge section="Morning" count={5} />
        <SlotBadge section="Afternoon" count={3} />
        <SlotBadge section="Evening" count={2} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <SlotBadge section="Morning" count={5} variant="ghost" />
        <SlotBadge section="Afternoon" count={3} variant="ghost" />
        <SlotBadge section="Evening" count={2} variant="ghost" />
      </div>
    </div>
  ),
}
