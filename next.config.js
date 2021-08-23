const withMDX = require("@next/mdx")();

module.exports = withMDX({
  webpack5: process.env.NODE_ENV !== "production",
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "en",
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
