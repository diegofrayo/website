const withMDX = require("@next/mdx")();

module.exports = withMDX({
  i18n: {
    locales: ["en-US", "es-419"],
    defaultLocale: "es-419",
  },
});
