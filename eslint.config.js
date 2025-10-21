import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import nxPlugin from '@nx/eslint-plugin'

const jsRecommended = js.configs.recommended

export default [
  {
    ignores: ['dist', 'dist-ssr', '.next', 'out', 'node_modules'],
  },
  {
    ...jsRecommended,
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ...(jsRecommended.languageOptions ?? {}),
      sourceType: 'module',
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        process: 'readonly',
      },
      parserOptions: {
        ...(jsRecommended.languageOptions?.parserOptions ?? {}),
        ecmaFeatures: {
          ...(jsRecommended.languageOptions?.parserOptions?.ecmaFeatures ?? {}),
          jsx: true,
        },
      },
    },
    plugins: {
      ...(jsRecommended.plugins ?? {}),
      '@nx': nxPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...(jsRecommended.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true, varsIgnorePattern: '^[A-Z_]' }],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:frontend',
              onlyDependOnLibsWithTags: ['scope:frontend', 'scope:shared'],
            },
            {
              sourceTag: 'scope:backend',
              onlyDependOnLibsWithTags: ['scope:backend', 'scope:shared'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'domain:store',
              onlyDependOnLibsWithTags: ['domain:store', 'domain:core', 'scope:shared'],
            },
            {
              sourceTag: 'domain:core',
              onlyDependOnLibsWithTags: ['domain:core', 'scope:shared'],
            },
            {
              sourceTag: 'layer:controller',
              onlyDependOnLibsWithTags: ['layer:controller', 'layer:service', 'layer:dto', 'layer:util'],
            },
            {
              sourceTag: 'layer:service',
              onlyDependOnLibsWithTags: ['layer:service', 'layer:repository', 'layer:dto', 'layer:util'],
            },
            {
              sourceTag: 'layer:repository',
              onlyDependOnLibsWithTags: ['layer:repository', 'layer:schema', 'layer:dto', 'layer:util'],
            },
            {
              sourceTag: 'layer:schema',
              onlyDependOnLibsWithTags: ['layer:schema', 'layer:util'],
            },
            {
              sourceTag: 'layer:dto',
              onlyDependOnLibsWithTags: ['layer:dto', 'layer:util'],
            },
            {
              sourceTag: 'layer:ui',
              onlyDependOnLibsWithTags: ['layer:ui', 'layer:util'],
            },
            {
              sourceTag: 'layer:util',
              onlyDependOnLibsWithTags: ['layer:util'],
            },
          ],
        },
      ],
    },
  },
]
