import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import pluginReact from "eslint-plugin-react";
import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import css from "@eslint/css";

const JAVASCRIPT_CONFIG = {
	files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
	extends: ["js/recommended"],
	plugins: { js },
	languageOptions: { globals: globals.browser },
};

// NOTE: It is a config defined by eslint cli
const TYPESCRIPT_CONFIG = {
	files: ["**/*.{ts,tsx}"],
	extends: [tseslint.configs.recommended],
};

const REACT_CONFIG = {
	files: ["**/*.{ts,tsx}"],
	extends: [pluginReact.configs.flat["recommended"]],
	settings: { react: { version: "detect" } },
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

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
const STORYBOOK_CONFIG = {
	extends: [storybook.configs["flat/recommended"]],
};

export default defineConfig([
	...nextVitals,

	JAVASCRIPT_CONFIG,
	TYPESCRIPT_CONFIG,
	REACT_CONFIG,
	CSS_CONFIG,
	STORYBOOK_CONFIG,

	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
]);
