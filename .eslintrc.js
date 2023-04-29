module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'never',
        named: 'always',
        asyncArrow: 'always'
      }
    ],
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [
          '/^node/',
          'module',
          '/^(.|..)\//',
          '/^@app/',
          ['sibling']
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: false,
        }
      }
    ],
    'getter-return': 'error',
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'warn',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'warn',
    'no-extra-semi': 'warn',
    'no-mixed-spaces-and-tabs': 'off',
    'no-tabs': 'off',
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'never',
        named: 'always',
        asyncArrow: 'always'
      }
    ],
    'accessor-pairs': [
      'error',
      {
        getWithoutSet: true
      },
    ],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'typescript-eslint/return-await': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports'
      },
    ],
  },
};