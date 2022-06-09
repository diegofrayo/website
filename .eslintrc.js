module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "no-loops", "react-hooks", "@typescript-eslint"],
  ignorePatterns: ["public/**/*"],
  extends: [
    "airbnb",
    "airbnb-typescript",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    console: true,
    process: true,
    module: true,
    window: true,
  },
  rules: {
    "react/prop-types": "off",
    "import/no-unresolved": "off", // TODO
    "import/extensions": "off", // TODO
    "@typescript-eslint/naming-convention": "off", // TODO
    "@typescript-eslint/no-use-before-define": "off", // TODO
    "react/require-default-props": "off", // TODO
    "import/prefer-default-export": "off", // TODO
    "react/jsx-props-no-spreading": "off", // TODO
    "no-nested-ternary": "off",

    "no-debugger": "warn",
    "react/no-array-index-key": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",

    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-loops/no-loops": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
