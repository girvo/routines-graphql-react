import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CheckBox } from '../../primitives/CheckBox'

const meta = {
  title: 'Primitives/CheckBox',
  component: CheckBox,
} satisfies Meta<typeof CheckBox>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = ({ size, disabled }: { size?: 'sm' | 'md'; disabled?: boolean }) => {
  const [checked, setChecked] = useState(false)
  return (
    <CheckBox checked={checked} onChange={setChecked} size={size} disabled={disabled}>
      Remember me
    </CheckBox>
  )
}

export const Medium: Story = {
  render: () => <Controlled />,
}

export const Small: Story = {
  render: () => <Controlled size="sm" />,
}

export const NoVisibleLabel: Story = {
  render: () => {
    const Wrapper = () => {
      const [checked, setChecked] = useState(false)
      return <CheckBox checked={checked} onChange={setChecked} aria-label="Complete task" />
    }
    return <Wrapper />
  },
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <CheckBox checked={false} aria-label="unchecked md" />
        <CheckBox checked aria-label="checked md" />
        <CheckBox checked={false} disabled aria-label="disabled md" />
        <CheckBox checked disabled aria-label="disabled checked md" />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <CheckBox size="sm" checked={false} aria-label="unchecked sm" />
        <CheckBox size="sm" checked aria-label="checked sm" />
        <CheckBox size="sm" checked={false} disabled aria-label="disabled sm" />
        <CheckBox size="sm" checked disabled aria-label="disabled checked sm" />
      </div>
    </div>
  ),
}
