import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from './Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', children: 'New task', leadingIcon: Plus },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Add task', leadingIcon: Plus },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Cancel' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete', leadingIcon: Trash2 },
}

export const IconOnly: Story = {
  args: { variant: 'secondary', iconOnly: ChevronLeft, 'aria-label': 'Previous' },
}

export const States: Story = {
  args: { children: 'Button' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" leadingIcon={Plus}>New task</Button>
        <Button variant="primary" leadingIcon={Plus} disabled>New task</Button>
        <Button variant="primary" leadingIcon={Plus} loading>New task</Button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" leadingIcon={Plus}>Add task</Button>
        <Button variant="secondary" leadingIcon={Plus} disabled>Add task</Button>
        <Button variant="secondary" loading>Saving</Button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="ghost">Cancel</Button>
        <Button variant="ghost" disabled>Cancel</Button>
        <Button variant="secondary" iconOnly={ChevronLeft} aria-label="Prev" />
        <Button variant="secondary" iconOnly={ChevronRight} aria-label="Next" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="destructive" leadingIcon={Trash2}>Delete</Button>
        <Button variant="destructive" leadingIcon={Trash2} disabled>Delete</Button>
        <Button variant="destructive" loading>Deleting</Button>
      </div>
    </div>
  ),
}
