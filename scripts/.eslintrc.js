module.exports = {
	ignorePatterns: [".ts-node/**/*", ".eslintrc.js"],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
		ecmaFeatures: {},
	},
	rules: {
		"@typescript-eslint/explicit-function-return-type": "off",
		"import/no-extraneous-dependencies": ["error", { devDependencies: true }],
		"no-console": "off",
	},
};
