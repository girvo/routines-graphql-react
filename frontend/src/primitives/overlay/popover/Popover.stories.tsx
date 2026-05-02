import type { Meta, StoryObj } from '@storybook/react-vite'
import { MoreHorizontal, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../Button'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

const meta = {
  title: 'Primitives/Overlay/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const OverflowMenu: Story = {
  args: { children: null },
  render: () => (
    <div style={{ padding: 80 }}>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Button variant="ghost" iconOnly={MoreHorizontal} aria-label="More actions" />
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
            <button style={{ textAlign: 'left', padding: '6px 8px' }}>Edit</button>
            <button style={{ textAlign: 'left', padding: '6px 8px' }}>Duplicate</button>
            <button style={{ textAlign: 'left', padding: '6px 8px', color: '#b91c1c' }}>
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const BottomStart: Story = {
  args: { children: null },
  render: () => (
    <div style={{ padding: 80 }}>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button variant="secondary" trailingIcon={ChevronDown}>
            Options
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 8 }}>Anchored bottom-start.</div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const FlipsAboveNearViewportBottom: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button variant="secondary">Near bottom — should flip up</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 8, height: 200, width: 200 }}>
            200×200 content. Opens above the trigger when the bottom of the viewport is too close.
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

const ControlledTemplate = () => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ padding: 80, display: 'flex', gap: 12 }}>
      <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
        Toggle from outside
      </Button>
      <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
        <PopoverTrigger>
          <Button variant="secondary">Anchor</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ padding: 8 }}>Controlled open state.</div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledTemplate />,
}
