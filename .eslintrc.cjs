module.exports = {
  root: true,
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '**/playwright-report/**',
    '**/test-results/**',
    '**/allure-results/**',
    '**/allure-report/**',
    '**/blob-report/**',
  ],
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.property.name='waitForTimeout']",
        message:
          'Deterministic waits only (§3, §18.3): waitForTimeout is banned. Use condition-based deterministic waits only.',
      },
      {
        selector: "CallExpression[callee.name='setTimeout']",
        message:
          'Deterministic waits only (§3, §18.3): setTimeout is banned. Use condition-based deterministic waits only.',
      },
      {
        selector:
          "CallExpression[callee.property.name='locator'][arguments.0.type='Literal'][arguments.0.value=/^(\\.|#|\\/\\/|xpath=)/]",
        message:
          'Stable locators only (§3, §81, §18.3): CSS class chains, id selectors, and XPath are banned. Use getByTestId, getByRole, getByLabel.',
      },
    ],
  },
  overrides: [
    // Rule: Ban URL string literals outside config/ and mocks/
    {
      files: ['**/*.ts', '**/*.js'],
      excludedFiles: ['**/config/**', '**/mocks/**', '*.config.ts', '*.config.js', '*.cjs'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "CallExpression[callee.property.name='waitForTimeout']",
            message:
              'Deterministic waits only (§3, §18.3): waitForTimeout is banned. Use condition-based deterministic waits only.',
          },
          {
            selector: "CallExpression[callee.name='setTimeout']",
            message:
              'Deterministic waits only (§3, §18.3): setTimeout is banned. Use condition-based deterministic waits only.',
          },
          {
            selector:
              "CallExpression[callee.property.name='locator'][arguments.0.type='Literal'][arguments.0.value=/^(\\.|#|\\/\\/|xpath=)/]",
            message:
              'Stable locators only (§3, §81, §18.3): CSS class chains, id selectors, and XPath are banned. Use getByTestId, getByRole, getByLabel.',
          },
          {
            selector: 'Literal[value=/^https?:\\/\\//]',
            message:
              'Hardcoded URL literals are banned outside config/ and mocks/ (§3, §18.3). Retrieve URLs from config or endpoints.ts.',
          },
          {
            selector: 'TemplateElement[value.raw=/https?:\\/\\//]',
            message:
              'Hardcoded URL literals in template strings are banned outside config/ and mocks/ (§3, §18.3). Retrieve URLs from config or endpoints.ts.',
          },
        ],
      },
    },
    // Rule: Page objects and component objects NEVER assert (§7.3)
    {
      files: ['**/pages/**/*.ts', '**/components/**/*.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "CallExpression[callee.name='expect']",
            message:
              'Page objects and component objects NEVER assert (§7.3). They return state and locators. Assertions live only in steps/ and tests/.',
          },
          {
            selector: "CallExpression[callee.property.name='waitForTimeout']",
            message:
              'Deterministic waits only (§3, §18.3): waitForTimeout is banned. Use condition-based deterministic waits only.',
          },
          {
            selector: "CallExpression[callee.name='setTimeout']",
            message:
              'Deterministic waits only (§3, §18.3): setTimeout is banned. Use condition-based deterministic waits only.',
          },
          {
            selector:
              "CallExpression[callee.property.name='locator'][arguments.0.type='Literal'][arguments.0.value=/^(\\.|#|\\/\\/|xpath=)/]",
            message:
              'Stable locators only (§3, §81, §18.3): CSS class chains, id selectors, and XPath are banned. Use getByTestId, getByRole, getByLabel.',
          },
          {
            selector: 'Literal[value=/^https?:\\/\\//]',
            message:
              'Hardcoded URL literals are banned outside config/ and mocks/ (§3, §18.3). Retrieve URLs from config or endpoints.ts.',
          },
          {
            selector: 'TemplateElement[value.raw=/https?:\\/\\//]',
            message:
              'Hardcoded URL literals in template strings are banned outside config/ and mocks/ (§3, §18.3). Retrieve URLs from config or endpoints.ts.',
          },
        ],
      },
    },
    // Rule: packages/core must NEVER import from projects/* (§3, §18.3)
    {
      files: ['packages/core/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['*projects*', '**/projects/**', '../*projects*'],
                message:
                  'packages/core must never import from projects/* (§3). Core must be completely project-agnostic.',
              },
            ],
          },
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector: 'ImportDeclaration[source.value=/projects/]',
            message:
              'packages/core must never import from projects/* (§3). Core must be completely project-agnostic.',
          },
        ],
      },
    },
  ],
};
