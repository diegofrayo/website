const myCustomClassesPlugin = require("./scripts/styles/tailwind");

module.exports = {
  prefix: "tw-",
  darkMode: "class",
  important: false,
  plugins: [myCustomClassesPlugin],
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    {
      pattern: /^(sm:|md:)?(tw-my-|tw-mx-|tw-mt-|tw-mb-)\d{1,2}$/,
    },
    {
      pattern: /dfr-/,
    },
    {
      pattern: /tw-max-w/,
    },
  ],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }
    },
    extend: {
      transitionDuration: {
        DEFAULT: "500ms",
      },
      zIndex: {
        "-1": "-1",
      },
      lineHeight: {
        0: "0",
      },
      inset: {
        "1px": "1px",
        "-1px": "-1px",
      },
      fontSize: {
        xxs: "0.6rem",
        // test: "0rem",
      },
      borderWidth: {
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
      },
    },
  },
};
