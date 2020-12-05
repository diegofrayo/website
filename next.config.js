const withMDX = require("@next/mdx")();

module.exports = withMDX({
  /*
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
  },
  */
  redirects() {
    return [
      {
        source: "/acerca-de-mi",
        destination: "/about-me",
        permanent: true,
      },
    ];
  },
});
