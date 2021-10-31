const withMDX = require("@next/mdx");

module.exports = withMDX()({
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "en",
    localeDetection: false,
  },
  redirects() {
    return [
      {
        source: "/blog/conectando-un-proyecto-de-firebase-con-un-dominio-de-go-daddy",
        destination: "/blog/connecting-a-firebase-project-with-a-go-daddy-domain",
        permanent: true,
        locale: false,
      },
      {
        source: "/es/blog/conectando-un-proyecto-de-firebase-con-un-dominio-de-go-daddy",
        destination: "/es/blog/connecting-a-firebase-project-with-a-go-daddy-domain",
        permanent: true,
        locale: false,
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
