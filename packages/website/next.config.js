const withMDX = require("@next/mdx")();

module.exports = withMDX({
  future: {
    webpack5: false,
    strictPostcssConfiguration: false,
  },
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
    localeDetection: false,
  },
  redirects() {
    return [
      {
        source: "/acerca-de-mi",
        destination: "/about-me",
        permanent: true,
      },
      {
        source: "/blog/mi-primer-post",
        destination: "/blog/my-first-post",
        permanent: true,
      },
    ];
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
