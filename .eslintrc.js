const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("node:constants");

module.exports = {
  extends: ['airbnb-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 0,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'no-param-reassign': 0,
  },
  env: {
    node: true,
    jest: true,
  },
};
