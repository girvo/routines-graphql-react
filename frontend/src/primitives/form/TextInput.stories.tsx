import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { Search } from 'lucide-react'
import { TextInput } from './TextInput'

const meta = {
  title: 'Primitives/Form/TextInput',
  component: TextInput,
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Bordered: Story = {
  args: { placeholder: 'Search tasks', leadingIcon: Search },
}

export const Filled: Story = {
  args: { variant: 'filled', placeholder: 'Search tasks', leadingIcon: Search },
}

export const Ghost: Story = {
  args: { variant: 'ghost', placeholder: 'New task name' },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <TextInput size="sm" placeholder="sm (32)" leadingIcon={Search} />
      <TextInput size="md" placeholder="md (36)" leadingIcon={Search} />
    </div>
  ),
}

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: 24,
      width: 360,
      background: 'var(--surface-bg)',
      border: '1px solid var(--stroke-line)',
      borderRadius: 12,
    }}
  >
    {children}
  </div>
)

export const States: Story = {
  render: () => (
    <Panel>
      <TextInput placeholder="Bordered empty" leadingIcon={Search} />
      <TextInput defaultValue="Bordered value" leadingIcon={Search} />
      <TextInput placeholder="Bordered disabled" leadingIcon={Search} disabled />
      <TextInput variant="filled" placeholder="Filled empty" leadingIcon={Search} />
      <TextInput variant="filled" defaultValue="Filled value" leadingIcon={Search} />
      <TextInput variant="ghost" placeholder="Ghost inline" />
      <TextInput variant="ghost" defaultValue="Ghost with value" />
    </Panel>
  ),
}
