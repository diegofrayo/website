const withMDX = require("@next/mdx")();

module.exports = withMDX({
  webpack5: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    localeDetection: false,
  },
  webpack(config) {
    config.module.rules.concat([
      {
        test: /\.mdx/,
        use: [{ loader: "xdm/webpack.cjs", options: {} }],
      },
    ]);

    return config;
  },
});
