import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../../../primitives/text/Heading'

const meta = {
  title: 'Primitives/Text/Heading',
  component: Heading,
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Section heading' },
}
