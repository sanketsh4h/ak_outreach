import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Local rule: no visible text written directly in a component. Interface text
 * comes from locales/*.json and content text from the content files, so that
 * every string can be translated.
 */
const TEXT_ATTRIBUTES = new Set(['alt', 'title', 'placeholder', 'aria-label', 'aria-description'])
const noHardcodedText = {
  meta: {
    type: 'problem',
    messages: {
      literal:
        'Visible text must come from locales/*.json (t()) or a content file, not be written in the component.',
    },
  },
  create(context) {
    return {
      JSXText(node) {
        if (/\p{L}/u.test(node.value)) context.report({ node, messageId: 'literal' })
      },
      JSXAttribute(node) {
        const name = node.name.type === 'JSXIdentifier' ? node.name.name : ''
        if (!TEXT_ATTRIBUTES.has(name) || !node.value) return
        if (node.value.type === 'Literal' && /\p{L}/u.test(String(node.value.value))) {
          context.report({ node, messageId: 'literal' })
        }
      },
    }
  },
}

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'test-results', 'playwright-report']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2023, globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    plugins: { local: { rules: { 'no-hardcoded-text': noHardcodedText } } },
    rules: { 'local/no-hardcoded-text': 'error' },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: { 'local/no-hardcoded-text': 'off' },
  },
])
