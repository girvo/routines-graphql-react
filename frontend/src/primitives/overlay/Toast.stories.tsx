import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toast } from './Toast'

const meta = {
  title: 'Primitives/Overlay/Toast',
  component: Toast,
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Error: Story = {
  args: { type: 'error', children: 'Something went wrong saving your task.' },
}

export const Success: Story = {
  args: { type: 'success', children: 'Task created successfully.' },
}

export const Warning: Story = {
  args: { type: 'warning', children: 'This task has no routine slots assigned.' },
}

export const Info: Story = {
  args: { type: 'info', children: 'Autosaving every 30 seconds.' },
}

export const Dismissible: Story = {
  args: {
    type: 'success',
    children: 'Task created.',
    onDismiss: () => {},
  },
}

export const Stack: Story = {
  args: { type: 'info', children: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      <Toast type="success" onDismiss={() => {}}>Task created.</Toast>
      <Toast type="info" onDismiss={() => {}}>Autosaving…</Toast>
      <Toast type="warning" onDismiss={() => {}}>No slots assigned.</Toast>
      <Toast type="error" onDismiss={() => {}}>Failed to save.</Toast>
    </div>
  ),
}
