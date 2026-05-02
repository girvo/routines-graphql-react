import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flower, Droplet, Footprints, BookOpen, Moon, Mail } from 'lucide-react'
import { IconBadge } from './IconBadge'

const meta = {
  title: 'Primitives/Badge/IconBadge',
  component: IconBadge,
} satisfies Meta<typeof IconBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {
  args: { icon: Flower, 'aria-label': 'Meditate' },
}

export const Small: Story = {
  args: { icon: Flower, size: 'sm', 'aria-label': 'Meditate' },
}

export const Gallery: Story = {
  args: { icon: Flower },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <IconBadge icon={Flower} aria-label="Meditate" />
        <IconBadge icon={Droplet} aria-label="Water" />
        <IconBadge icon={Footprints} aria-label="Walk" />
        <IconBadge icon={BookOpen} aria-label="Read" />
        <IconBadge icon={Moon} aria-label="Sleep" />
        <IconBadge icon={Mail} aria-label="Inbox" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <IconBadge icon={Flower} size="sm" aria-label="Meditate" />
        <IconBadge icon={Droplet} size="sm" aria-label="Water" />
        <IconBadge icon={Footprints} size="sm" aria-label="Walk" />
        <IconBadge icon={BookOpen} size="sm" aria-label="Read" />
        <IconBadge icon={Moon} size="sm" aria-label="Sleep" />
        <IconBadge icon={Mail} size="sm" aria-label="Inbox" />
      </div>
    </div>
  ),
}
