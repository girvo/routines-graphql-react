import type { Meta, StoryObj } from '@storybook/react-vite'
import { Body } from '../primitives/text/Body'
import { Label } from '../primitives/text/Label'
import { Mono } from '../primitives/text/Mono'

type Token = { name: string; cssVar: string }
type Group = { heading: string; tokens: Token[] }

const groups: Group[] = [
  {
    heading: 'Surface',
    tokens: [
      { name: 'Surface', cssVar: '--surface' },
      { name: 'Bg', cssVar: '--surface-bg' },
      { name: 'Bg Soft', cssVar: '--surface-bg-soft' },
      { name: 'Soft', cssVar: '--surface-soft' },
      { name: 'Table Head', cssVar: '--surface-table-head' },
      { name: 'Avatar Bg', cssVar: '--surface-avatar-bg' },
      { name: 'Inline Create', cssVar: '--surface-inline-create' },
    ],
  },
  {
    heading: 'Text',
    tokens: [
      { name: 'Ink', cssVar: '--text-ink' },
      { name: 'Ink 2', cssVar: '--text-ink-2' },
      { name: 'Muted', cssVar: '--text-muted' },
      { name: 'Muted Soft', cssVar: '--text-muted-soft' },
    ],
  },
  {
    heading: 'Stroke',
    tokens: [
      { name: 'Line', cssVar: '--stroke-line' },
      { name: 'Hairline', cssVar: '--stroke-hairline' },
    ],
  },
  {
    heading: 'Brand',
    tokens: [{ name: 'Accent', cssVar: '--accent' }],
  },
]

const Chip = ({ token }: { token: Token }) => {
  const resolved =
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement)
          .getPropertyValue(token.cssVar)
          .trim()
      : ''

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        width: 160,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 72,
          borderRadius: 6,
          background: `var(${token.cssVar})`,
          border: '1px solid var(--stroke-line)',
        }}
      />
      <Body size="sm" strong>
        {token.name}
      </Body>
      <Mono size="xs">{token.cssVar}</Mono>
      <Mono size="xs">{resolved.toUpperCase()}</Mono>
    </div>
  )
}

const Palette = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
    {groups.map(group => (
      <section
        key={group.heading}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Label>{group.heading.toUpperCase()}</Label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 160px)',
            gap: 20,
          }}
        >
          {group.tokens.map(t => (
            <Chip key={t.cssVar} token={t} />
          ))}
        </div>
      </section>
    ))}
  </div>
)

const meta = {
  title: 'Design/Colors',
  component: Palette,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Palette>

export default meta
type Story = StoryObj<typeof meta>

export const Palette_: Story = { name: 'Palette' }
