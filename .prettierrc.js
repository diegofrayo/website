module.exports = {
	// global
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,

	// common
	bracketSpacing: true,
	singleQuote: false,

	// js
	arrowParens: "always",
	semi: true,
	trailingComma: "all",

	// plugins
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindFunctions: ["cva", "cn"],

	// jsx
	bracketSameLine: false,
	singleAttributePerLine: true,
};
