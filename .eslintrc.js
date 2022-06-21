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
    // rules left to read about them and remove
    "react/jsx-props-no-spreading": "off", // TODO
    "react/jsx-no-bind": "off", // TODO
    "class-methods-use-this": "warn", // TODO

    // TODO: rules about accesibility
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/media-has-caption": "off",

    // rules configured by myself
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        prefix: ["I_"],
      },
      {
        selector: "typeAlias",
        format: ["PascalCase"],
        prefix: ["T_"],
      },
    ],
    "@typescript-eslint/no-use-before-define": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "no-nested-ternary": "off",
    "react/jsx-fragments": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",

    "@typescript-eslint/ban-ts-comment": "warn",
    "import/prefer-default-export": "warn",
    "no-debugger": "warn",

    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-shadow": ["error", { allow: ["params", "data", "result"] }],
    "@typescript-eslint/no-unused-vars": "error",
    "no-loops/no-loops": "error",
    "no-restricted-exports": ["error", { restrictedNamedExports: [] }],
    "react/no-array-index-key": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
