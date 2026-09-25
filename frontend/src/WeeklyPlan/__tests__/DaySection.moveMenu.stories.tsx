import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  BOTTOM_ORDER,
  BOTTOM_TITLES,
  chooseMove,
  commandIn,
  createEnvironmentWith,
  deferredMoveResolver,
  mockSection,
  moveOperations,
  openMoveMenu,
  PLANKS,
  PUSHUPS,
  READ_ORDER,
  readTheServerBack,
  settleTheMove,
  SQUATS,
  titlesInOrder,
} from './DaySection.storyHarness'
import { DaySectionStoryView } from './DaySection.storyView'

const meta = {
  title: 'WeeklyPlan/DaySection/Move menu',
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const styleRules = (sheet: CSSStyleSheet) => {
  try {
    return Array.from(sheet.cssRules)
  } catch {
    return []
  }
}

const plainFocusHighlightSelectors = (
  element: HTMLElement,
  rules: CSSRule[],
): string[] =>
  rules.flatMap(rule => {
    if (rule instanceof CSSStyleRule) {
      if (!/outline|background/.test(rule.style.cssText)) return []
      return rule.selectorText
        .split(',')
        .map(part => part.trim())
        .filter(
          part =>
            part.includes(':focus') &&
            !part.includes(':focus-visible') &&
            (() => {
              try {
                return element.matches(part)
              } catch {
                return false
              }
            })(),
        )
    }
    return 'cssRules' in rule
      ? plainFocusHighlightSelectors(
          element,
          Array.from((rule as CSSGroupingRule).cssRules),
        )
      : []
  })

const highlightsOnPlainFocus = (element: HTMLElement) =>
  plainFocusHighlightSelectors(
    element,
    Array.from(document.styleSheets).flatMap(sheet => styleRules(sheet)),
  )

export const CommandsSendRelativeTargets: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(READ_ORDER),
          deferredMoveResolver(READ_ORDER),
          deferredMoveResolver(READ_ORDER),
          deferredMoveResolver(READ_ORDER),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    await chooseMove(canvasElement, 'Squats', 'Move up')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(1)
    })
    expect(moveOperations[0]?.request.variables.input).toEqual({
      routineSlotId: SQUATS.id,
      to: 'TOP',
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    await chooseMove(canvasElement, 'Squats', 'Move down')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(2)
    })
    expect(moveOperations[1]?.request.variables.input).toEqual({
      routineSlotId: SQUATS.id,
      to: 'BOTTOM',
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    await chooseMove(canvasElement, 'Pushups', 'Move down')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(3)
    })
    expect(moveOperations[2]?.request.variables.input).toEqual({
      routineSlotId: PUSHUPS.id,
      afterRoutineSlotId: SQUATS.id,
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    await chooseMove(canvasElement, 'Planks', 'Move up')
    await waitFor(() => {
      expect(moveOperations).toHaveLength(4)
    })
    expect(moveOperations[3]?.request.variables.input).toEqual({
      routineSlotId: PLANKS.id,
      beforeRoutineSlotId: SQUATS.id,
    })
    settleTheMove()
    await readTheServerBack(canvasElement)

    const menu = await openMoveMenu(canvasElement, 'Pushups')
    const alreadyFirst = within(menu).getByRole('menuitem', {
      name: 'Move up',
    })
    expect(alreadyFirst).toBeDisabled()
    await userEvent.click(alreadyFirst)
    expect(moveOperations).toHaveLength(4)
  },
}

export const ScreenReaderHearsTheNewPosition: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver([SQUATS, PUSHUPS, PLANKS]),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')
    cleanup()

    await openMoveMenu(canvasElement, 'Pushups')
    const menu = await screen.findByRole('menu')
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map(item => item.textContent),
    ).toEqual(['Move up', 'Move down', 'Move to top', 'Move to bottom'])
    expect(menu).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    expect(
      within(menu).getByRole('menuitem', { name: 'Move down' }),
    ).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    expect(
      within(menu).getByRole('menuitem', { name: 'Move to bottom' }),
    ).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'Move Pushups' })).toHaveFocus()

    await chooseMove(canvasElement, 'Pushups', 'Move down')

    expect(canvas.getByRole('button', { name: 'Move Pushups' })).toHaveFocus()

    settleTheMove()

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          'Pushups moved to position 2 of 3',
        )
      },
      { timeout: 3000 },
    )
  },
}

export const SecondMoveIsNotOfferedWhileOneIsInFlight: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(READ_ORDER),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    await chooseMove(canvasElement, 'Pushups', 'Move to bottom')

    await waitFor(() => {
      expect(titlesInOrder(canvasElement)).toEqual(BOTTOM_TITLES)
    })

    const menu = await openMoveMenu(canvasElement, 'Squats')
    const items = await within(menu).findAllByRole('menuitem')
    items.forEach(item => expect(item).toBeDisabled())

    settleTheMove()

    await readTheServerBack(canvasElement)
    expect(moveOperations).toHaveLength(1)
  },
}

export const PointerOpenedMenuSelectsNoCommand: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', READ_ORDER)],
          deferredMoveResolver(BOTTOM_ORDER),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Pushups')

    const mouseMenu = await openMoveMenu(canvasElement, 'Squats')
    expect(mouseMenu).toHaveFocus()
    expect(commandIn(mouseMenu, 'Move up')).not.toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    const firstCommand = commandIn(mouseMenu, 'Move up')
    expect(firstCommand).toHaveFocus()
    expect(highlightsOnPlainFocus(firstCommand)).not.toHaveLength(0)

    await userEvent.keyboard('{Escape}')

    canvas.getByRole('button', { name: 'Move Squats' }).focus()
    await userEvent.keyboard('{Enter}')
    const keyboardMenu = await screen.findByRole('menu')
    expect(commandIn(keyboardMenu, 'Move up')).toHaveFocus()

    await userEvent.keyboard('{Escape}')

    const topRowMenu = await openMoveMenu(canvasElement, 'Pushups')
    expect(commandIn(topRowMenu, 'Move up')).toBeDisabled()
    expect(commandIn(topRowMenu, 'Move down')).not.toHaveFocus()

    await userEvent.keyboard('{Tab}')
    expect(commandIn(topRowMenu, 'Move down')).toHaveFocus()

    await userEvent.keyboard('{Escape}')
  },
}
