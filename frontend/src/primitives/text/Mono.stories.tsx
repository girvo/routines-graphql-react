import type { Meta, StoryObj } from '@storybook/react-vite'
import { Mono } from './Mono'

const meta = {
  title: 'Primitives/Text/Mono',
  component: Mono,
} satisfies Meta<typeof Mono>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'npm install' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Mono size="sm">Mono Sm — 12px</Mono>
      <Mono size="xs">Mono Xs — 11px</Mono>
    </div>
  ),
}
