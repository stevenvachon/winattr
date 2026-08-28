/** @type {import("prettier").Config} */
export default {
  arrowParens: 'avoid',
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  overrides: [
    {
      files: 'src/shellGetAttributes.js',
      options: {
        trailingComma: 'none',
      },
    },
  ],
};
