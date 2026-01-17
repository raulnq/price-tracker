import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['**/dist/**/*']),
  jseslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['eslint.config.ts', 'commitlint.config.ts', 'prettier.config.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['backend/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './backend/tsconfig.json',
      },
    },
  },
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './frontend/tsconfig.app.json',
      },
    },
  },
  {
    files: ['frontend/vite.config.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './frontend/tsconfig.node.json',
      },
    },
  }
);
