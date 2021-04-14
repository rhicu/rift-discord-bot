module.exports = {
  extends: ['airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 0,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0
  },
  env: {
    node: true,
    jest: true,
  },
};
