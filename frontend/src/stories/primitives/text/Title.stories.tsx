import type { Meta, StoryObj } from '@storybook/react-vite'
import { Title } from '../../../primitives/text/Title'

const meta = {
  title: 'Primitives/Text/Title',
  component: Title,
} satisfies Meta<typeof Title>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Weekly Plan' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Title size="lg" as="h1">Title Lg — 20px / 600</Title>
      <Title size="md" as="h2">Title Md — 18px / 600</Title>
      <Title size="sm" as="h3">Title Sm — 15px / 600</Title>
    </div>
  ),
}
