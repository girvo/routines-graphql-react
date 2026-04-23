import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { AppShell } from '../../shell/AppShell'

const meta = {
  title: 'Shell/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

const slot = (label: string, bg: string, height?: number): ReactNode => (
  <div
    style={{
      background: bg,
      height: height ?? '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#555',
      fontSize: 13,
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      border: '1px dashed #ccc',
      boxSizing: 'border-box',
    }}
  >
    {label}
  </div>
)

export const Default: Story = {
  render: () => (
    <AppShell
      sidebar={<div style={{ width: 240, height: '100%' }}>{slot('Sidebar (240)', '#f5f5f5')}</div>}
      topBar={slot('TopBar (48)', '#fafafa', 48)}
      dock={slot('Dock (56)', '#fafafa', 56)}
    >
      {slot('Main content', '#ffffff')}
    </AppShell>
  ),
}

export const NoSidebar: Story = {
  render: () => (
    <AppShell topBar={slot('TopBar', '#fafafa', 48)} dock={slot('Dock', '#fafafa', 56)}>
      {slot('Main content', '#ffffff')}
    </AppShell>
  ),
}

export const OnlyMain: Story = {
  render: () => <AppShell>{slot('Main content', '#ffffff')}</AppShell>,
}
