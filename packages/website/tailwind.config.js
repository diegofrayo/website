const plugin = require("tailwindcss/plugin");

module.exports = {
  prefix: "tw-",
  darkMode: "class",
  important: false,
  plugins: [plugin(myCustomClassesPlugin)],
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
    opacity: ["responsive", "hover", "dark"],
    padding: ["responsive", "last", "hover", "dark"],
  },
};

// --- Utilities ---

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

function myCustomClassesPlugin({ addUtilities, config, e }) {
  const newClasses = {
    "twc-mt-base": {
      marginTop: config("theme.spacing")["3"],
    },
    "twc-mb-base": {
      marginBottom: config("theme.spacing")["6"],
    },
    "twc-max-w-base": {
      maxWidth: config("theme.screens")["md"],
    },

    "twc-bg-main": {
      light: {
        backgroundColor: "white",
      },
      dark: {
        backgroundColor: "#282c34",
      },
    },
    "twc-text-color-primary": {
      light: {
        color: config("theme.colors").gray["700"],
      },
      dark: {
        color: "#ffffff",
      },
    },
    "twc-text-color-secondary": {
      light: {
        color: config("theme.colors").black,
      },
      dark: {
        color: "#FAC863",
      },
    },
    "twc-text-color-links": {
      light: {
        color: config("theme.colors").blue["700"],
      },
      dark: {
        color: "#8CC790",
      },
    },
    "twc-border-color-primary": {
      light: {
        borderColor: config("theme.colors").gray["200"],
      },
      dark: {
        borderColor: config("theme.colors").gray["600"],
      },
    },
    "twc-bg-icons": {
      light: {
        backgroundColor: config("theme.colors").gray["100"],
      },
      dark: {
        backgroundColor: config("theme.colors").gray["500"],
      },
    },
  };

  const transformedNewClasses = Object.entries(newClasses).reduce(
    (acum, [key, value]) => {
      if (value.light && value.dark) {
        acum[`.${key}`] = value.light;
        acum[`.${e(`value:dark:${key}`)}`] = value.dark;
        acum[`.tw-dark .${e(`dark:${key}`)}`] = value.dark;
      } else {
        acum[`.${key}`] = value;
      }

      return acum;
    },
    {},
  );

  addUtilities(transformedNewClasses, {
    respectPrefix: false,
  });
}
