import type { Meta, StoryObj } from '@storybook/react-vite'
import { SlotChip } from './SlotChip'

const meta = {
  title: 'Primitives/SlotChip',
  component: SlotChip,
} satisfies Meta<typeof SlotChip>

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
        <SlotChip section="Morning" count={5} />
        <SlotChip section="Afternoon" count={3} />
        <SlotChip section="Evening" count={2} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <SlotChip section="Morning" count={5} variant="ghost" />
        <SlotChip section="Afternoon" count={3} variant="ghost" />
        <SlotChip section="Evening" count={2} variant="ghost" />
      </div>
    </div>
  ),
}
