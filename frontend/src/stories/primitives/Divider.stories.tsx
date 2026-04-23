import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from '../../primitives/Divider'

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <div style={{ padding: '8px 0' }}>Above</div>
      <Divider />
      <div style={{ padding: '8px 0' }}>Below</div>
    </div>
  ),
}

export const Inset: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <div style={{ padding: '8px 0' }}>Above</div>
      <Divider inset={16} />
      <div style={{ padding: '8px 0' }}>Below</div>
    </div>
  ),
}

export const BetweenRows: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      {['Morning pages', 'Stretch', 'Plan the day'].map((label, i, arr) => (
        <div key={label}>
          <div style={{ padding: '10px 12px' }}>{label}</div>
          {i < arr.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  ),
}
