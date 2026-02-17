// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import astroParser from 'astro-eslint-parser';
import astroPlugin from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  // 1. Configuración base recomendada de ESLint
  js.configs.recommended,

  // 2. Configuración para archivos TypeScript (.ts)
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json', // Asegura que tengas este archivo
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Aquí puedes añadir reglas personalizadas si quieres
    },
  },

  // 3. Configuración para archivos Astro (.astro)
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ...globals.browser,
        Astro: 'readonly', // Variable global de Astro
      },
    },
    plugins: {
      astro: astroPlugin,
    },
    rules: {
      ...astroPlugin.configs.recommended.rules,
      // Reglas específicas para Astro
    },
  },

  // 4. Configuración para JSX (accesibilidad)
  {
    files: ['**/*.{jsx,tsx,astro}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },

  // 5. Prettier (siempre al final para que sobrescriba reglas de estilo)
  prettier,
];
