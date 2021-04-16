module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "no-loops", "react-hooks", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    console: true,
  },
  ignorePatterns: ["src/components/pages/snippets/data/**/*"],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/no-unresolved": "off",

    "@typescript-eslint/explicit-module-boundary-types": "warn",

    "@typescript-eslint/no-unused-vars": "error",
    "no-loops/no-loops": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
