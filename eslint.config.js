module.export = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', 
    'plugin:react/recommended', 
    'plugin:react-native/all',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }], 
    'react/react-in-jsx-scope': 'off', 
    '@typescript-eslint/explicit-function-return-type': 'off', 
    'react-native/no-inline-styles': 'off', 
    'react-native/no-raw-text': 'off', 
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};