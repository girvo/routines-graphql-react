import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DayToggle } from './DayToggle'

const meta = {
  title: 'Primitives/Form/DayToggle',
  component: DayToggle,
} satisfies Meta<typeof DayToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Unselected: Story = {
  args: { day: 'Mon' },
}

export const Selected: Story = {
  args: { day: 'Wed', selected: true },
}

export const Disabled: Story = {
  args: { day: 'Mon', disabled: true },
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WeekTemplate = () => {
  const [selected, setSelected] = useState<Set<string>>(

      () => new Set(['Mon', 'Wed', 'Fri']),
    )
  const toggle = (day: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {DAYS.map((day) => (
        <DayToggle
          key={day}
          day={day}
          selected={selected.has(day)}
          onClick={() => toggle(day)}
        />
      ))}
    </div>
  )
}

export const Week: Story = {
  args: { day: 'Mon' },
  render: () => <WeekTemplate />,
}
