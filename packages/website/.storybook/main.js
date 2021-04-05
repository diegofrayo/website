const path = require("path");
const { lstatSync, readdirSync } = require("fs");

function getSrcDirectories() {
  const isDirectory = source => lstatSync(source).isDirectory();

  const source = path.resolve(__dirname, "../src");

  return readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory)
    .map(directory => directory.substring(directory.lastIndexOf("/") + 1));
}

module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
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
    "storybook-addon-themes",
  ],
  webpackFinal: async baseConfig => {
    const nextConfig = require("../next.config.js");

    baseConfig.resolve = {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      modules: [path.resolve(__dirname, "../src"), "node_modules"],
      alias: getSrcDirectories().reduce((result, directory) => {
        result[`~/${directory}`] = path.resolve(__dirname, `../src/${directory}`);
        return result;
      }, {}),
    };

    return { ...nextConfig.webpack, ...baseConfig };
  },
};
