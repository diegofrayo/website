const plugin = require("tailwindcss/plugin");
const { generateTailwindConfig } = require("./scripts/styles/tailwind");

module.exports = {
  // mode: "jit",
  prefix: "tw-",
  darkMode: "class",
  important: false,
  plugins: [plugin(myCustomClassesPlugin)],
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{ts,tsx}"],
    options: {
      safelist: [/^(sm:|md:)?(tw-my-|tw-mx-|tw-mt-|tw-mb-)\d{1,2}$/, /dfr-/],
    },
  },
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }
    },
    extend: {
      lineHeight: {
        0: "0",
      },
      inset: {
        "1px": "1px",
        "-1px": "-1px",
      },
      fontSize: {
        xxs: "0.5rem",
      },
    },
  },
  variants: {
    borderRadius: ["responsive", "last", "hover", "dark"],
    borderWidth: ["responsive", "last", "hover", "dark"],
    boxShadow: ["responsive", "hover", "dark"],
    fontWeight: ["hover"],
    height: ["responsive", "last", "hover", "dark"],
    inset: ["responsive", "hover"],
    margin: ["responsive", "last", "dark"],
    opacity: ["responsive", "hover", "dark"],
    padding: ["responsive", "last", "hover", "dark"],
    translate: ["hover"],
    width: ["responsive", "last", "hover", "dark"],
  },
};

// --- Plugins ---

function myCustomClassesPlugin({ addUtilities, e }) {
  addUtilities(generateTailwindConfig(e), { respectPrefix: false });
}
