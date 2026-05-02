import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Modal } from './Modal'
import { ConfirmDialog } from './ConfirmDialog'

const meta = {
  title: 'Primitives/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

function DefaultStory() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal title"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        Body content. Escape and click outside dismiss. Focus returns to the
        trigger.
      </Modal>
    </>
  )
}

export const Default: Story = {
  args: {
    open: false,
    onClose: () => {},
    title: 'Modal title',
    children: 'Body content.',
  },
  render: () => <DefaultStory />,
}

function ConfirmStory() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete item
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete Task"
        confirmLabel="Delete"
        destructive
      >
        Are you sure you want to delete "Morning walk"? This action cannot be
        undone.
      </ConfirmDialog>
    </>
  )
}

export const Confirm: Story = {
  args: {
    open: false,
    onClose: () => {},
    children: '',
  },
  render: () => <ConfirmStory />,
}
