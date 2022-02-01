module.exports = {
    env: {
      commonjs: true,
      es2021: true,
      node: true,
    },
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
      ecmaVersion: 12,
    },
    plugins: ['prefer-arrow'],
    rules: {
      'linebreak-style': ['error', 'unix'],
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
  };
  