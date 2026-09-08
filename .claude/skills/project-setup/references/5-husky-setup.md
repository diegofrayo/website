# Step 5: husky-setup

Installs Husky + lint-staged and configures a pre-commit hook that runs type-checking, linting, and a build.

## Instructions

- Install dev dependencies:
  ```sh
  pnpm i -D husky lint-staged@16.4.0
  ```
- Add to `package.json` scripts (if not already present from step 1):
  ```json
  "===== SETUP =====": "",
  "husky:install": "husky",
  ```
- Add the lint-staged config creating `lint-staged.config.js` file:
  ```js
  const baseConfig = ["prettier --write", "eslint"];

  export default {
    "src/**/*.{ts,tsx}": baseConfig,
    "tests/**/*.{ts,tsx}": baseConfig,
  };
  ```
- Run:
  ```sh
  npm run husky:install
  ```
- Create or overwrite `.husky/pre-commit`:
  ```sh
  #!/bin/sh

  npm run build:ts
  npx lint-staged
  npm run build
  ```
