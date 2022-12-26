module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["prettier", "no-loops", "@typescript-eslint"],
	extends: [
		"airbnb",
		"airbnb-typescript",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/errors",
		"plugin:import/typescript",
		"plugin:import/warnings",
		"plugin:prettier/recommended",
		"prettier",
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
	},
	rules: {},
};

// const warnRulesValue = process.env.NO_LINT_WARNINGS ? "off" : "warn";

// module.exports = {
// 	root: true,
// 	parser: "@typescript-eslint/parser",
// 	plugins: ["prettier", "no-loops", "@typescript-eslint"],
// 	ignorePatterns: ["public/**/*"],
// 	extends: [
// 		"airbnb",
// 		"airbnb-typescript",
// 		"eslint:recommended",
// 		"plugin:@typescript-eslint/recommended",
// 		"plugin:import/errors",
// 		"plugin:import/typescript",
// 		"plugin:import/warnings",
// 		"plugin:prettier/recommended",
// 		"prettier",
// 	],
// 	parserOptions: {
// 		ecmaVersion: 2018,
// 		sourceType: "module",
// 		project: "./tsconfig.json",
// 		ecmaFeatures: {},
// 	},
// 	globals: {
// 		console: true,
// 		module: true,
// 		process: true,
// 		window: true,
// 	},
// 	rules: {
// 		// --- Rules configured by myself --
// 		"@typescript-eslint/no-use-before-define": "off",
// 		"class-methods-use-this": "off",
// 		"import/extensions": "off",
// 		"import/no-unresolved": "off",
// 		"no-nested-ternary": "off",

// 		"@typescript-eslint/ban-ts-comment": warnRulesValue,
// 		"import/prefer-default-export": warnRulesValue,
// 		"no-alert": warnRulesValue,
// 		"no-console": warnRulesValue,
// 		"no-debugger": warnRulesValue,

// 		"@typescript-eslint/naming-convention": [
// 			"error",
// 			{
// 				selector: "interface",
// 				format: ["PascalCase"],
// 				prefix: ["I_"],
// 			},
// 			{
// 				selector: "typeAlias",
// 				format: ["PascalCase"],
// 				prefix: ["T_"],
// 			},
// 		],
// 		"@typescript-eslint/explicit-function-return-type": "error",
// 		"@typescript-eslint/no-explicit-any": "error",
// 		"@typescript-eslint/no-shadow": ["error", { allow: ["params", "data", "result"] }],
// 		"@typescript-eslint/no-unused-vars": "error",
// 		"no-loops/no-loops": "error",
// 		"no-restricted-exports": ["error", { restrictedNamedExports: [] }],
// 	},
// };
