import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import nxPlugin from '@nx/eslint-plugin'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })
const nextConfigs = compat.extends('next/core-web-vitals')

export default [
  {
    ignores: [
      'dist',
      'dist-ssr',
      '.next',
      '**/.next/**',
      'out',
      'node_modules',
    ],
  },
  ...nextConfigs,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        process: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
      },
    },
    settings: {
      next: {
        rootDir: ['apps/frontend'],
        pagesDir: [],
      },
    },
    plugins: {
      '@nx': nxPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@next/next/no-html-link-for-pages': 'off',
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^[A-Z_]',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
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
              onlyDependOnLibsWithTags: [
                'domain:store',
                'domain:core',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'domain:core',
              onlyDependOnLibsWithTags: ['domain:core', 'scope:shared'],
            },
            {
              sourceTag: 'layer:controller',
              onlyDependOnLibsWithTags: [
                'layer:controller',
                'layer:service',
                'layer:dto',
                'layer:util',
              ],
            },
            {
              sourceTag: 'layer:service',
              onlyDependOnLibsWithTags: [
                'layer:service',
                'layer:repository',
                'layer:dto',
                'layer:util',
              ],
            },
            {
              sourceTag: 'layer:repository',
              onlyDependOnLibsWithTags: [
                'layer:repository',
                'layer:schema',
                'layer:dto',
                'layer:util',
              ],
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
