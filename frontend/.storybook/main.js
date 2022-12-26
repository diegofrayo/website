const path = require("path");
const fs = require("fs");

const SOURCE_CODE_PATHNAME = path.resolve(__dirname, "../src");

module.exports = {
	stories: ["../src/stories/**/*.stories.tsx"],
	addons: [
		"storybook-addon-themes",
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		{
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					implementation: require("postcss"),
				},
			},
		},
	],
	webpackFinal: async (baseConfig) => {
		const nextConfig = require("../next.config.js");

		baseConfig.resolve = {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			modules: [SOURCE_CODE_PATHNAME, "node_modules"],
			alias: generateDirectoriesAlias(SOURCE_CODE_PATHNAME),
		};

		return { ...nextConfig.webpack, ...baseConfig };
	},
};

// --- Utils ---

function generateDirectoriesAlias(source) {
	function isDirectory(source) {
		return fs.lstatSync(source).isDirectory();
	}

	function getAllChildsName(name) {
		return path.join(source, name);
	}

	function getDirectoryName(directory) {
		return directory.substring(directory.lastIndexOf("/") + 1);
	}

	return fs
		.readdirSync(source)
		.map(getAllChildsName)
		.filter(isDirectory)
		.map(getDirectoryName)
		.reduce((result, directory) => {
			return {
				...result,
				[`~/${directory}`]: path.resolve(source, directory),
			};
		}, {});
}
