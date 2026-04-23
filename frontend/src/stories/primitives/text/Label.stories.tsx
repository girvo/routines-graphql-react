import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '../../../primitives/text/Label'

const meta = {
  title: 'Primitives/Text/Label',
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'EMAIL ADDRESS' },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label variant="default">Default — 11px / 600 / 0.9 tracking</Label>
      <Label variant="tight">Tight — 11px / 600 / 0.8 tracking</Label>
    </div>
  ),
}
