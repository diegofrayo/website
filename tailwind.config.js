const plugin = require("tailwindcss/plugin");

const prefix = "tw-";
module.exports = {
  prefix,
  darkMode: "class",
  important: false,
  plugins: [
    plugin(function ({ addUtilities, config }) {
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

        ".twc-text-color-base": {
          color: config("theme.colors").gray["700"],
        },

        ".twc-text-color-secondary": {
          color: config("theme.colors").black,
        },

        ".twc-text-color-links": {
          color: config("theme.colors").blue["700"],
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
    borderWidth: ["responsive", "last", "hover"],
    margin: ["responsive", "last"],
    inset: ["responsive", "hover"],
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
