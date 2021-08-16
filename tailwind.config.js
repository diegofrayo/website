const plugin = require("tailwindcss/plugin");

module.exports = {
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
      borderRadius: {
        full: "100%",
      },
      leading: {
        0: "0",
      },
      inset: {
        "1px": "1px",
        "2px": "2px",
        "3px": "3px",
        "-1px": "-1px",
      },
      lineHeight: {
        0: "0",
      },
      fontSize: {
        xxs: "0.5rem",
      },
    },
  },
  variants: {
    borderRadius: ["responsive", "last", "hover", "dark"],
    borderWidth: ["responsive", "last", "hover", "dark"],
    inset: ["responsive", "hover"],
    margin: ["responsive", "last", "dark"],
    opacity: ["responsive", "hover", "dark"],
    padding: ["responsive", "last", "hover", "dark"],
    width: ["responsive", "last", "hover", "dark"],
    height: ["responsive", "last", "hover", "dark"],
    translate: ["hover"],
    boxShadow: ["responsive", "hover", "dark"],
  },
};

// --- Utilities ---

function myCustomClassesPlugin({ addUtilities, config, e }) {
  const newClasses = {
    "dfr-max-w-base": {
      maxWidth: config("theme.screens")["md"],
    },

    "dfr-bg-primary": {
      light: {
        backgroundColor: "white",
      },
      dark: {
        backgroundColor: "#282c34",
      },
    },
    "dfr-bg-secondary": {
      light: {
        backgroundColor: config("theme.colors").gray["200"],
      },
      dark: {
        backgroundColor: config("theme.colors").gray["500"],
      },
    },
    "dfr-text-color-primary": {
      light: {
        color: config("theme.colors").gray["700"],
      },
      dark: {
        color: config("theme.colors").gray["200"],
      },
    },
    "dfr-text-color-secondary": {
      light: {
        color: config("theme.colors").black,
      },
      dark: {
        color: "#FAC863",
      },
    },
    "dfr-text-color-links": {
      light: {
        color: config("theme.colors").blue["700"],
      },
      dark: {
        color: "#8CC790",
      },
    },
    "dfr-border-color-primary": {
      light: {
        borderColor: config("theme.colors").gray["200"],
      },
      dark: {
        borderColor: config("theme.colors").gray["600"],
      },
    },
  };

  const transformedNewClasses = Object.entries(newClasses).reduce((acum, [key, value]) => {
    if (value.light && value.dark) {
      acum[`.${key}`] = value.light;
      acum[`.${e(`value:dark:${key}`)}`] = value.dark;
      acum[`.tw-dark .${e(`dark:${key}`)}`] = value.dark;
    } else {
      acum[`.${key}`] = value;
    }

    return acum;
  }, {});

  addUtilities(transformedNewClasses, {
    respectPrefix: false,
  });
}
