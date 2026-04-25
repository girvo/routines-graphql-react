import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Calendar, CalendarDays, ListTodo, Settings, LogOut } from 'lucide-react'
import { NavItem } from '../../primitives/NavItem'

const meta = {
  title: 'Primitives/NavItem',
  component: NavItem,
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {
  args: { icon: Calendar, label: 'Today' },
}

export const Active: Story = {
  args: { icon: Calendar, label: 'Today', active: true },
}

export const WithCount: Story = {
  args: { icon: ListTodo, label: 'Tasks', count: 6 },
}

const ITEMS = [
  { key: 'today', icon: Calendar, label: 'Today' },
  { key: 'weekly', icon: CalendarDays, label: 'Weekly' },
  { key: 'tasks', icon: ListTodo, label: 'Tasks', count: 6 },
  { key: 'settings', icon: Settings, label: 'Settings' },
  { key: 'logout', icon: LogOut, label: 'Log out' },
]

const SidebarTemplate = () => {
  const [current, setCurrent] = useState('today')
  return (
    <div style={{ width: 216, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {ITEMS.map((item) => (
        <NavItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          count={item.count}
          active={current === item.key}
          onClick={() => setCurrent(item.key)}
        />
      ))}
    </div>
  )
}

export const Sidebar: Story = {
  args: { icon: Calendar, label: 'Today' },
  render: () => <SidebarTemplate />,
}
