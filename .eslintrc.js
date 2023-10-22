const warnRulesValue = process.env.NO_LINT_WARNINGS ? "off" : "warn";

module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["prettier", "no-loops", "react-hooks", "@typescript-eslint"],
	ignorePatterns: [
		"*.config.js",
		".docs/**/*",
		".eslintrc.js",
		"public/**/*",
		"tailwind.config.ts",
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
		"next/core-web-vitals",
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
		ecmaFeatures: { jsx: true },
		tsconfigRootDir: __dirname,
		project: "./tsconfig.json",
	},
	globals: {
		console: true,
		module: true,
		process: true,
		window: true,
	},
	rules: {
		// --- WARN: Rules about accesibility ---
		"jsx-a11y/click-events-have-key-events": "off",
		"jsx-a11y/media-has-caption": "off",

		// --- NOTE: Rules configured by myself --
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-use-before-define": "off",
		"class-methods-use-this": "off",
		"import/extensions": "off",
		"import/no-unresolved": "off",
		"no-nested-ternary": "off",
		"react/destructuring-assignment": "off",
		"react/jsx-fragments": "off",
		"react/prop-types": "off",
		"react/require-default-props": "off",

		"@typescript-eslint/ban-ts-comment": warnRulesValue,
		"@typescript-eslint/ban-types": [
			warnRulesValue,
			{
				types: {
					Function: true,
				},
				extendDefaults: true,
			},
		],
		"import/prefer-default-export": warnRulesValue,
		"no-alert": warnRulesValue,
		"no-console": warnRulesValue,
		"no-debugger": warnRulesValue,
		"react/jsx-props-no-spreading": [
			warnRulesValue,
			{
				html: "ignore",
			},
		],
		"react/no-array-index-key": warnRulesValue,
		"react/no-danger": warnRulesValue,

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
		"@typescript-eslint/no-explicit-any": "error",
		"@typescript-eslint/no-shadow": ["error", { allow: ["params", "data", "result"] }],
		"@typescript-eslint/no-unused-vars": "error",
		"no-loops/no-loops": "error",
		"no-restricted-exports": ["error", { restrictedNamedExports: [] }],
		"react/jsx-no-bind": [
			"error",
			{
				allowFunctions: true,
			},
		],
		"react/no-unknown-property": [
			"error",
			{
				ignore: ["jsx", "global"],
			},
		],
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
