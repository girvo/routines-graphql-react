import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { AppShellFrame } from '../../shell/AppShellFrame'

const meta = {
  title: 'Shell/AppShellFrame',
  component: AppShellFrame,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShellFrame>

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
  args: { children: null },
  render: () => (
    <AppShellFrame
      sidebar={<div style={{ width: 240, height: '100%' }}>{slot('Sidebar (240)', '#f5f5f5')}</div>}
      topBar={slot('TopBar (48)', '#fafafa', 48)}
      dock={slot('Dock (56)', '#fafafa', 56)}
    >
      {slot('Main content', '#ffffff')}
    </AppShellFrame>
  ),
}

export const NoSidebar: Story = {
  args: { children: null },
  render: () => (
    <AppShellFrame topBar={slot('TopBar', '#fafafa', 48)} dock={slot('Dock', '#fafafa', 56)}>
      {slot('Main content', '#ffffff')}
    </AppShellFrame>
  ),
}

export const OnlyMain: Story = {
  args: { children: null },
  render: () => <AppShellFrame>{slot('Main content', '#ffffff')}</AppShellFrame>,
}
