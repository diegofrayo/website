# Step 3: eslint-setup

Installs ESLint and creates the flat config (`eslint.config.mts`) with JS, TS, React, and CSS rules.

## Instructions

- Install dev dependencies:
  ```sh
  pnpm i -D @eslint/css @eslint/js eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks globals jiti typescript-eslint
  ```
- Create `eslint.config.mts` at the project root:
  ```ts
  import js from "@eslint/js";
  import pluginReact from "eslint-plugin-react";
  import reactHooks from "eslint-plugin-react-hooks";
  import { defineConfig, globalIgnores } from "eslint/config";
  import globals from "globals";
  import tseslint from "typescript-eslint";
  import css from "@eslint/css";

  const JAVASCRIPT_CONFIG = {
    files: ["**/*.{mts,ts,tsx}"],
    extends: [js.configs.recommended],
    plugins: { js },
    languageOptions: { globals: globals.browser },
  };

  const TYPESCRIPT_CONFIG = {
    files: ["**/*.{mts,ts,tsx}"],
    extends: [tseslint.configs.recommended],
  };

  const REACT_CONFIG = {
    files: ["**/*.{ts,tsx}"],
    extends: [pluginReact.configs.flat["recommended"], reactHooks.configs.flat.recommended],
    settings: { react: { version: "19" } },
    rules: {
      "react/react-in-jsx-scope": ["off"],
      "no-console": ["warn"],
      "@typescript-eslint/ban-ts-comment": ["warn"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { caughtErrors: "none", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  };

  const CSS_CONFIG = {
    files: ["**/*.{css}"],
    extends: ["css/recommended"],
    plugins: { css },
    language: "css/css",
  };

  export default defineConfig([
    JAVASCRIPT_CONFIG,
    TYPESCRIPT_CONFIG,
    REACT_CONFIG,
    CSS_CONFIG,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  ]);
  ```
