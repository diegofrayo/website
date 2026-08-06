import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
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

const TYPESCRIPT_CONFIG = tseslint.config(
	{ ignores: ["node_modules"] },
	...tseslint.configs.recommended,
	{ files: ["**/*.{mts,ts,tsx}"] },
);

const REACT_CONFIG = {
	files: ["**/*.{ts,tsx}"],
	ignores: ["@diegofrayo-features/**/*"],
	extends: [pluginReact.configs.flat["recommended"], reactHooks.configs.flat.recommended],
	settings: { react: { version: "19" } },
	rules: {
		// NOTE: Ifs statements rules
		"no-extra-boolean-cast": "error",
		"no-negated-condition": "error",
		"no-else-return": "error",
		"no-lonely-if": "error",

		"max-lines": ["error", { max: 300, skipBlankLines: true }],
		"max-lines-per-function": ["error", { max: 150, skipBlankLines: true, skipComments: true }],

		"no-console": ["warn"],
		"react/react-in-jsx-scope": ["off"],
		"@typescript-eslint/ban-ts-comment": ["warn"],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ caughtErrors: "none", caughtErrorsIgnorePattern: "^_" },
		],
	},
};

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
const STORYBOOK_CONFIG = {
	extends: [storybook.configs["flat/recommended"]],
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
	CSS_CONFIG,
	REACT_CONFIG,
	STORYBOOK_CONFIG,
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
