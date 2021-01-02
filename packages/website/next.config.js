const withMDX = require("@next/mdx")();

module.exports = withMDX({
  i18n: {
    locales: ["en", "es"],
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
});
