import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './Alert'

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Error: Story = {
  args: { type: 'error', children: 'Email or password is incorrect.' },
}

export const Success: Story = {
  args: { type: 'success', children: 'Your settings have been saved.' },
}

export const Warning: Story = {
  args: {
    type: 'warning',
    children: 'This task has no slots assigned to any day.',
  },
}

export const Info: Story = {
  args: { type: 'info', children: 'You can drag slots between days.' },
}

export const WithTitle: Story = {
  args: {
    type: 'error',
    title: 'Could not save',
    children: 'The server rejected the request. Please try again.',
  },
}
