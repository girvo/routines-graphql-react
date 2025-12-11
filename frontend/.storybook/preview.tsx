import type { Preview } from '@storybook/react-vite'
import { createMemoryRouter, RouterProvider } from 'react-router'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    // Ensures we have a router around the thing
    (Story, { parameters }) => {
      const entry = parameters.currentPath ?? '/'
      const title = parameters.pageTitle ?? ''
      const childComponent = parameters.pageComponent ?? (() => null)

      const router = createMemoryRouter(
        [
          {
            path: '*',
            element: <Story />,
            handle: { title },
            children: [
              {
                path: '*',
                Component: childComponent,
              },
            ],
          },
        ],
        { initialEntries: [entry] },
      )

      return <RouterProvider router={router} />
      // return (
      //   <MemoryRouter initialEntries={[entry]}>
      //     <Story />
      //   </MemoryRouter>
      // )
    },
  ],
}

export default preview
