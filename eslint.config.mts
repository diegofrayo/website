import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import checkFile from "eslint-plugin-check-file";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import css from "@eslint/css";

const javascriptConfig = {
	files: ["src/**/*.{mts,ts,tsx}"],
	extends: [js.configs.recommended],
	plugins: { js },
	languageOptions: { globals: globals.browser },
};

const filenameConventions = {
	ignores: [
		"src/features/pages/blog/pages/\\[slug\\]/\\[slug\\].page.tsx",
		"src/pages/404.tsx",
		"src/pages/500.tsx",
		"src/pages/_app.tsx",
		"src/pages/_document.tsx",
		"src/pages/blog/\\[slug\\].ts",
	],
	plugins: {
		"check-file": checkFile,
	},
	rules: {
		"check-file/filename-naming-convention": [
			"error",
			{ "src/**/*": "KEBAB_CASE" },
			{
				// ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
				ignoreMiddleExtensions: true,
			},
		],
	},
};

const typescriptConfig = defineConfig({
	files: ["src/**/*.{mts,ts,tsx}"],
	extends: [tseslint.configs.recommended, tseslint.configs.recommendedTypeChecked],
	languageOptions: {
		parserOptions: {
			projectService: true,
		},
	},
	rules: {
		// NOTE: Ifs statements rules
		"no-extra-boolean-cast": "error",
		"no-negated-condition": "error",
		"no-else-return": "error",
		"no-lonely-if": "error",

		"max-lines": ["error", { max: 300, skipBlankLines: true }],
		"max-lines-per-function": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
		"max-params": ["error", 3],
		"no-console": ["warn"],

		"@typescript-eslint/ban-ts-comment": ["warn"],
		"@typescript-eslint/consistent-type-imports": "error",
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/no-floating-promises": "error",
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrors: "none" }],
	},
});

const reactConfig = {
	files: ["src/**/*.{ts,tsx}"],
	extends: [
		pluginReact.configs.flat["recommended"],
		reactHooks.configs.flat.recommended,
		tseslint.configs.recommendedTypeChecked,
	],
	settings: { react: { version: "19" } },
	rules: {
		"react/react-in-jsx-scope": ["off"],
	},
};

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
const storybookConfig = {
	extends: [storybook.configs["flat/recommended"]],
};

const cssConfig = {
	files: ["src/**/*.{css}"],
	extends: ["css/recommended"],
	plugins: { css },
	language: "css/css",
};

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,

	javascriptConfig,
	filenameConventions,
	typescriptConfig,
	cssConfig,
	reactConfig,
	storybookConfig,

	{ settings: { react: { version: "19" } } },
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		"node_modules",
		"public/assets/pages/demo/bets",
		"playwright-report",
	]),
]);

export default eslintConfig;
