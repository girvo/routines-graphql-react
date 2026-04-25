import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../../primitives/Field'
import { TextInput } from '../../primitives/TextInput'

const meta = {
  title: 'Primitives/Field',
  component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    label: 'Email',
    children: <TextInput type="email" placeholder="you@example.com" />,
  },
}

export const WithHint: Story = {
  args: {
    label: 'Password',
    hint: 'Minimum 8 characters.',
    children: <TextInput type="password" placeholder="Password" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Must be a valid email address.',
    children: <TextInput type="email" error placeholder="you@example.com" />,
  },
}

export const HiddenLabel: Story = {
  args: {
    label: 'Search',
    hideLabel: true,
    children: <TextInput type="search" placeholder="Search…" />,
  },
}
