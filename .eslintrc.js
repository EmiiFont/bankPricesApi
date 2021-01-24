module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "google",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "/tests/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    quotes: ["error", "double"],
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "max-len": "off",
    "object-curly-spacing": "off",
    indent: "off",
    "operator-linebreak": "off",
  },
};
