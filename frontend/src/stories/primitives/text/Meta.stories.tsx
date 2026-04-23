import type { Meta as SBMeta, StoryObj } from '@storybook/react-vite'
import { Meta } from '../../../primitives/text/Meta'

const meta = {
  title: 'Primitives/Text/Meta',
  component: Meta,
} satisfies SBMeta<typeof Meta>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Updated 2 hours ago' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Meta size="md">Meta Md — 12px / 400</Meta>
      <Meta size="sm">Meta Sm — 13px / 400</Meta>
      <Meta size="xs">Meta Xs — 11px / 400</Meta>
      <Meta size="md" strong>Meta Strong Md — 12px / 500</Meta>
      <Meta size="sm" strong>Meta Strong Sm — 13px / 500</Meta>
    </div>
  ),
}
