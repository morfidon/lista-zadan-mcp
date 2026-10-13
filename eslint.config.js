import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', '.claude/**'] },
  js.configs.recommended,
  {
    files: ['src/app.js', 'src/storage.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['server.js', 'tests/**/*.js'],
    languageOptions: { globals: globals.node },
  },
];
