module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "no-loops", "react-hooks", "@typescript-eslint"],
  ignorePatterns: [
    "public/**/*",
    "src/components/pages/music/components/TextFormatter.tsx",
    "src/components/pages/personal/*/timer/**/*",
    "src/i18n",
    "src/lib/guitar",
    "src/state",
    "src/stories",
  ],
  extends: [
    "airbnb",
    "airbnb-typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "prettier",
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
    module: true,
    process: true,
    window: true,
  },
  rules: {
    "@typescript-eslint/naming-convention": "off", // TODO
    "@typescript-eslint/no-use-before-define": "off", // TODO
    "import/extensions": "off", // TODO
    "import/no-unresolved": "off", // TODO
    "import/prefer-default-export": "off", // TODO
    "react/jsx-props-no-spreading": "off", // TODO
    "react/require-default-props": "off", // TODO
    "no-nested-ternary": "off",
    "react/jsx-fragments": "off",
    "react/jsx-no-bind": "off",
    "react/prop-types": "off",

    "class-methods-use-this": "warn", // TODO
    "@typescript-eslint/ban-ts-comment": "warn",
    "jsx-a11y/media-has-caption": "warn",
    "no-debugger": "warn",
    "react/no-array-index-key": "warn",

    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-shadow": ["error", { allow: ["params", "data", "result"] }],
    "@typescript-eslint/no-unused-vars": "error",
    "no-loops/no-loops": "error",
    "no-restricted-exports": ["error", { restrictedNamedExports: [] }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
