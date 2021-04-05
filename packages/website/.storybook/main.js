const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  // webpackFinal: async baseConfig => {
  //   const nextConfig = require("../next.config.js");

  //   baseConfig.resolve = {
  //     ...baseConfig.resolve,
  //     extensions: [".ts", ".tsx"],
  //     modules: [path.resolve(__dirname, "../src"), "node_modules"],
  //     alias: {
  //       "~/*": path.resolve(__dirname, "../src"),
  //     },
  //   };

  //   return { ...nextConfig.webpack, ...baseConfig };
  // },
};
