import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { subDays } from 'date-fns'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Primitives/Form/DatePicker',
  component: DatePicker,
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = ({ initial }: { initial?: Date | null }) => {
  const [value, setValue] = useState<Date | null>(initial ?? null)
  return <DatePicker value={value} onChange={setValue} />
}

export const Empty: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <Controlled />,
}

export const WithValue: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <Controlled initial={subDays(new Date(), 3)} />,
}

export const Disabled: Story = {
  args: { value: null, onChange: () => {} },
  render: () => <DatePicker value={null} onChange={() => {}} disabled />,
}
