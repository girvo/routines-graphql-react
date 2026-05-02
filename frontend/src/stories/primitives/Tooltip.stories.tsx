import type { Meta, StoryObj } from '@storybook/react-vite'
import { X, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../../primitives/Button'
import { Tooltip } from '../../primitives/Tooltip'

const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const IconButton: Story = {
  args: { label: 'Remove', children: <span /> },
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip label="Remove">
        <Button variant="ghost" size="sm" iconOnly={X} aria-label="Remove" />
      </Tooltip>
    </div>
  ),
}

export const Bottom: Story = {
  args: { label: 'Edit task', children: <span /> },
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip label="Edit task" side="bottom">
        <Button variant="ghost" size="sm" iconOnly={Pencil} aria-label="Edit task" />
      </Tooltip>
    </div>
  ),
}

export const FlipsBelowNearViewportTop: Story = {
  args: { label: 'Flips down', children: <span /> },
  render: () => (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'flex-start', padding: 16 }}>
      <Tooltip label="Tooltip flips down when the trigger is near the top">
        <Button variant="secondary">Near top — should flip down</Button>
      </Tooltip>
    </div>
  ),
}

export const ClampsToViewportEdge: Story = {
  args: { label: 'Long', children: <span /> },
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: 8 }}>
      <Tooltip label="A long tooltip label that would otherwise overflow the viewport">
        <Button variant="ghost" size="sm" iconOnly={X} aria-label="Near edge" />
      </Tooltip>
    </div>
  ),
}

export const RowOfActions: Story = {
  args: { label: '', children: <span /> },
  render: () => (
    <div style={{ padding: 80, display: 'flex', gap: 4 }}>
      <Tooltip label="Edit task">
        <Button variant="ghost" size="sm" iconOnly={Pencil} aria-label="Edit task" />
      </Tooltip>
      <Tooltip label="Delete task">
        <Button variant="ghost" size="sm" iconOnly={Trash2} aria-label="Delete task" />
      </Tooltip>
      <Tooltip label="Remove from slot">
        <Button variant="ghost" size="sm" iconOnly={X} aria-label="Remove from slot" />
      </Tooltip>
    </div>
  ),
}

export const OnLabelledButton: Story = {
  args: { label: 'Saves immediately', children: <span /> },
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip label="Saves immediately">
        <Button variant="primary">Save</Button>
      </Tooltip>
    </div>
  ),
}
