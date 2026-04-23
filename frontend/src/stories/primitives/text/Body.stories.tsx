import type { Meta, StoryObj } from '@storybook/react-vite'
import { Body } from '../../../primitives/text/Body'

const meta = {
  title: 'Primitives/Text/Body',
  component: Body,
} satisfies Meta<typeof Body>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'The quick brown fox jumps over the lazy dog.' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Body size="lg">Body Lg — 15px / 400</Body>
      <Body size="md">Body Md — 14px / 400</Body>
      <Body size="sm">Body Sm — 13px / 400</Body>
      <Body size="lg" strong>Body Strong Lg — 15px / 500</Body>
      <Body size="md" strong>Body Strong Md — 14px / 500</Body>
      <Body size="sm" strong>Body Strong Sm — 13px / 500</Body>
    </div>
  ),
}
