import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Flat config does not read .gitignore, so built and generated trees have to
  // be ignored here instead.
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    'backend/src/graphql/resolver-types.ts',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  tseslint.configs.recommended,
  {
    // The editor's ESLint server loads this config and frontend/eslint.config.js
    // in one process, where typescript-eslint cannot infer which root to use.
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    // Names starting with _ are parameters that are deliberately not read,
    // such as the unused GraphQL resolver parent.
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  pluginReact.configs.flat.recommended,
  // The frontend targets React 19 with the automatic JSX runtime, so JSX needs
  // no React import and react-in-jsx-scope must not apply.
  pluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      // react is only installed under frontend/, so it cannot be detected from
      // the workspace root where this config runs.
      react: { version: '19.2' },
    },
  },
  // The frontend's own eslint.config.js enables these rules; the root config
  // has to know the plugin too, otherwise inline directives such as
  // `eslint-disable react-hooks/refs` in frontend/src resolve to nothing.
  // Keep this preset in sync with frontend/eslint.config.js: both enable
  // react-hooks over the same files, and drift between the two makes
  // `eslint .` and `pnpm --filter @my-routines/frontend lint` disagree.
  {
    ...reactHooks.configs.flat.recommended,
    files: ['frontend/**/*.{js,jsx,ts,tsx}'],
  },
  {
    // Kysely types every generated migration's up/down as Kysely<any>; a
    // migration must not be tied to the current Database type.
    files: ['backend/migrations/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // backend/src/templates/graphiql.js is a plain browser script served as-is.
    // React, ReactDOM and GraphiQL arrive from the CDN <script> tags in
    // graphiql.html, so they are globals here rather than imports.
    files: ['backend/src/templates/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'readonly',
        ReactDOM: 'readonly',
        GraphiQL: 'readonly',
      },
    },
  },
])
