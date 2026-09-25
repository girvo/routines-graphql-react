import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { cleanup } from '@atlaskit/pragmatic-drag-and-drop-live-region'

import {
  chooseMove,
  commandIn,
  createEnvironmentWith,
  deferredMoveResolver,
  loadedRows,
  mockSection,
  MORNING,
  moveButtonOf,
  moveOperations,
  movedToEnd,
  openMoveMenu,
  reordered,
  rowFor,
  settleTheMove,
  slotIdsOf,
  titleOf,
  waitForOrder,
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
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(MORNING),
          deferredMoveResolver(MORNING),
          deferredMoveResolver(MORNING),
          deferredMoveResolver(MORNING),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    await loadedRows(canvasElement)
    const ids = slotIdsOf(canvasElement)
    const first = ids[0]
    const second = ids[1]
    const secondToLast = ids[ids.length - 2]
    const last = ids[ids.length - 1]

    const expectMoveSent = async (
      count: number,
      input: Record<string, string>,
    ) => {
      await waitFor(() => {
        expect(moveOperations).toHaveLength(count)
      })
      expect(moveOperations[count - 1]?.request.variables.input).toEqual(input)
      settleTheMove()
      await waitForOrder(canvasElement, ids)
    }

    await chooseMove(rowFor(canvasElement, second), 'Move up')
    await expectMoveSent(1, { routineSlotId: second, to: 'TOP' })

    await chooseMove(rowFor(canvasElement, secondToLast), 'Move down')
    await expectMoveSent(2, { routineSlotId: secondToLast, to: 'BOTTOM' })

    await chooseMove(rowFor(canvasElement, first), 'Move down')
    await expectMoveSent(3, {
      routineSlotId: first,
      afterRoutineSlotId: second,
    })

    await chooseMove(rowFor(canvasElement, last), 'Move up')
    await expectMoveSent(4, {
      routineSlotId: last,
      beforeRoutineSlotId: secondToLast,
    })

    const menu = await openMoveMenu(rowFor(canvasElement, first))
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
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(reordered(MORNING, 0, 1)),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [first] = await loadedRows(canvasElement)
    const total = slotIdsOf(canvasElement).length
    cleanup()

    const menu = await openMoveMenu(first)
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
    expect(moveButtonOf(first)).toHaveFocus()

    await chooseMove(first, 'Move down')

    expect(moveButtonOf(first)).toHaveFocus()

    settleTheMove()

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toHaveTextContent(
          `${titleOf(first)} moved to position 2 of ${total}`,
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
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(MORNING),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [first, second] = await loadedRows(canvasElement)
    const before = slotIdsOf(canvasElement)

    await chooseMove(first, 'Move to bottom')

    await waitForOrder(canvasElement, movedToEnd(before, 0))

    const menu = await openMoveMenu(second)
    const items = await within(menu).findAllByRole('menuitem')
    items.forEach(item => expect(item).toBeDisabled())

    settleTheMove()

    await waitForOrder(canvasElement, before)
    expect(moveOperations).toHaveLength(1)
  },
}

export const PointerOpenedMenuSelectsNoCommand: Story = {
  render: () => (
    <DaySectionStoryView
      createReadAndMoves={() =>
        createEnvironmentWith(
          [mockSection('MORNING', MORNING)],
          deferredMoveResolver(movedToEnd(MORNING, 0)),
        )
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const [first, second] = await loadedRows(canvasElement)

    const mouseMenu = await openMoveMenu(second)
    expect(mouseMenu).toHaveFocus()
    expect(commandIn(mouseMenu, 'Move up')).not.toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    const firstCommand = commandIn(mouseMenu, 'Move up')
    expect(firstCommand).toHaveFocus()
    expect(highlightsOnPlainFocus(firstCommand)).not.toHaveLength(0)

    await userEvent.keyboard('{Escape}')

    moveButtonOf(second).focus()
    await userEvent.keyboard('{Enter}')
    const keyboardMenu = await screen.findByRole('menu')
    expect(commandIn(keyboardMenu, 'Move up')).toHaveFocus()

    await userEvent.keyboard('{Escape}')

    const topRowMenu = await openMoveMenu(first)
    expect(commandIn(topRowMenu, 'Move up')).toBeDisabled()
    expect(commandIn(topRowMenu, 'Move down')).not.toHaveFocus()

    await userEvent.keyboard('{Tab}')
    expect(commandIn(topRowMenu, 'Move down')).toHaveFocus()

    await userEvent.keyboard('{Escape}')
  },
}
