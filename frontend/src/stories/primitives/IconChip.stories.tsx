import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flower, Droplet, Footprints, BookOpen, Moon, Mail } from 'lucide-react'
import { IconChip } from '../../primitives/IconChip'

const meta = {
  title: 'Primitives/IconChip',
  component: IconChip,
} satisfies Meta<typeof IconChip>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {
  args: { icon: Flower, 'aria-label': 'Meditate' },
}

export const Small: Story = {
  args: { icon: Flower, size: 'sm', 'aria-label': 'Meditate' },
}

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <IconChip icon={Flower} aria-label="Meditate" />
        <IconChip icon={Droplet} aria-label="Water" />
        <IconChip icon={Footprints} aria-label="Walk" />
        <IconChip icon={BookOpen} aria-label="Read" />
        <IconChip icon={Moon} aria-label="Sleep" />
        <IconChip icon={Mail} aria-label="Inbox" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <IconChip icon={Flower} size="sm" aria-label="Meditate" />
        <IconChip icon={Droplet} size="sm" aria-label="Water" />
        <IconChip icon={Footprints} size="sm" aria-label="Walk" />
        <IconChip icon={BookOpen} size="sm" aria-label="Read" />
        <IconChip icon={Moon} size="sm" aria-label="Sleep" />
        <IconChip icon={Mail} size="sm" aria-label="Inbox" />
      </div>
    </div>
  ),
}
