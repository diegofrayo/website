const plugin = require("tailwindcss/plugin");

module.exports = {
  prefix: "tw-",
  darkMode: "class",
  important: false,
  plugins: [
    plugin(function ({ addUtilities, config, e }) {
      const newUtilities = {
        ".twc-mt-base": {
          marginTop: config("theme.spacing")["3"],
        },
        ".twc-mb-base": {
          marginBottom: config("theme.spacing")["6"],
        },
        ".twc-max-w-base": {
          maxWidth: config("theme.screens")["md"],
        },

        ".twc-text-color-primary": {
          color: config("theme.colors").gray["700"],
        },
        ".twc-text-color-secondary": {
          color: config("theme.colors").black,
        },
        ".twc-text-color-links": {
          color: config("theme.colors").blue["700"],
        },
        ".twc-border-color-primary": {
          borderColor: config("theme.colors").gray["200"],
        },
        ".twc-bg-icons": {
          backgroundColor: config("theme.colors").gray["100"],
        },

        ".twc-text-color-primary--dark": {
          color: "#ffffff",
        },
        ".twc-text-color-secondary--dark": {
          color: "#FAC863",
        },
        ".twc-text-color-links--dark": {
          color: "#8CC790",
        },
        ".twc-border-color-primary--dark": {
          borderColor: config("theme.colors").gray["600"],
        },
        ".twc-bg-icons--dark": {
          backgroundColor: config("theme.colors").gray["100"],
        },
        [".tw-dark ." + e("dark:twc-text-color-primary")]: {
          color: "#ffffff",
        },
        [".tw-dark ." + e("dark:twc-text-color-secondary")]: {
          color: "#FAC863",
        },
        [".tw-dark ." + e("dark:twc-text-color-links")]: {
          color: "#8CC790",
        },
        [".tw-dark ." + e("dark:twc-border-color-primary")]: {
          borderColor: config("theme.colors").gray["600"],
        },
        [".tw-dark ." + e("dark:twc-bg-icons")]: {
          backgroundColor: config("theme.colors").gray["100"],
        },
      };

      addUtilities(newUtilities, {
        respectPrefix: false,
      });
    }),
  ],
  purge: {
    content: ["./src/components/**/*.tsx", "./src/pages/**/*.tsx"],
    options: {
      safelist: createWhitelist(),
    },
  },
  theme: {
    extend: {
      borderRadius: {
        full: "100%",
      },
      leading: {
        0: "0",
      },
      inset: {
        "1px": "1px",
      },
    },
  },
  variants: {
    borderRadius: ["responsive", "last", "hover", "dark"],
    borderWidth: ["responsive", "last", "hover", "dark"],
    inset: ["responsive", "hover"],
    margin: ["responsive", "last"],
    padding: ["responsive", "last", "hover", "dark"],
  },
};

function createWhitelist() {
  const breakpoints = ["", "sm:", "md:", "lg:", "xl:"];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];
  const margins = ["tw-my-", "tw-mx-", "tw-mb-", "tw-mt-"];
  const whitelist = [];

  margins.forEach(margin => {
    numbers.forEach(number => {
      breakpoints.forEach(breakpoint => {
        whitelist.push(`${breakpoint}${margin}${number}`);
      });
    });
  });

  return whitelist;
}
