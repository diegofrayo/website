module.exports = {
	// global
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	plugins: ["prettier-plugin-tailwindcss"],

	// common
	bracketSpacing: true,
	singleQuote: false,

	// js
	arrowParens: "always",
	semi: true,
	trailingComma: "all",

	// jsx
	bracketSameLine: false,
	singleAttributePerLine: true,

	// tailwind config
	tailwindFunctions: ["cva", "cn"],
};
