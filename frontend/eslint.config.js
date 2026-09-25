import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import relay from 'eslint-plugin-relay'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { relay },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...relay.configs['ts-strict'].rules,
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'relay-runtime',
              importNames: ['graphql'],
              message: "Import `graphql` from 'react-relay'.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'relay/must-colocate-fragment-spreads': 'off',
      'relay/unused-fields': 'off',
    },
  },
])
