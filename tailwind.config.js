const plugin = require("tailwindcss/plugin");
const colorConvert = require("color-convert");

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

// --- Utilities ---

function myCustomClassesPlugin({ addUtilities, config, e }) {
  const colorfulPrimary = config("theme.colors").yellow["500"];
  const newClasses = {
    "dfr-max-w-base": {
      maxWidth: config("theme.screens")["md"],
    },
    "dfr-transition-opacity": {
      transition: config("theme.transitionProperty").opacity,
      transitionDuration: config("theme.transitionDuration")["500"],
      "&:hover": {
        opacity: config("theme.opacity")[70],
      },
    },
    "dfr-shadow": {
      light: {
        boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.5)",
      },
      dark: {
        boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.2)",
      },
    },

    "dfr-bg-primary": {
      light: {
        backgroundColor: config("theme.colors").white,
      },
      dark: {
        backgroundColor: "#282c34",
      },
    },
    "dfr-bg-secondary": {
      light: {
        backgroundColor: config("theme.colors").gray["100"],
      },
      dark: {
        backgroundColor: config("theme.colors").gray["700"],
      },
    },
    "dfr-bg-strong": {
      light: {
        "--fallback": "1",
        backgroundColor: hexToRgba(
          config("theme.colors").black,
          "var(--tw-bg-opacity, var(--fallback))",
        ),
      },
      dark: {
        "--fallback": "1",
        backgroundColor: hexToRgba(
          config("theme.colors").white,
          "var(--tw-bg-opacity, var(--fallback))",
        ),
      },
    },
    "dfr-bg-strong-inverted": {
      light: {
        "--fallback": "1",
        backgroundColor: hexToRgba(
          config("theme.colors").white,
          "var(--tw-bg-opacity, var(--fallback))",
        ),
      },
      dark: {
        "--fallback": "1",
        backgroundColor: hexToRgba(
          config("theme.colors").black,
          "var(--tw-bg-opacity, var(--fallback))",
        ),
      },
    },
    "dfr-bg-colorful-primary": {
      backgroundColor: colorfulPrimary,
    },

    "dfr-text-primary": {
      light: {
        color: config("theme.colors").gray["700"],
      },
      dark: {
        color: config("theme.colors").gray["200"],
      },
    },
    "dfr-text-secondary": {
      light: {
        color: config("theme.colors").gray["500"],
      },
      dark: {
        color: config("theme.colors").gray["400"],
      },
    },
    "dfr-text-strong": {
      light: {
        color: config("theme.colors").black,
      },
      dark: {
        color: config("theme.colors").white,
      },
    },
    "dfr-text-strong-inverted": {
      light: {
        color: config("theme.colors").white,
      },
      dark: {
        color: config("theme.colors").black,
      },
    },
    "dfr-text-colorful-primary": {
      color: colorfulPrimary,
    },

    "dfr-border-primary": {
      light: {
        "--fallback": "1",
        borderColor: hexToRgba(
          config("theme.colors").gray["200"],
          "var(--tw-border-opacity, var(--fallback))",
        ),
      },
      dark: {
        "--fallback": "1",
        borderColor: hexToRgba(
          config("theme.colors").gray["600"],
          "var(--tw-border-opacity, var(--fallback))",
        ),
      },
    },
    "dfr-border-strong": {
      light: {
        "--fallback": "1",
        borderColor: hexToRgba(
          config("theme.colors").black,
          "var(--tw-border-opacity, var(--fallback))",
        ),
      },
      dark: {
        "--fallback": "1",
        borderColor: hexToRgba(
          config("theme.colors").white,
          "var(--tw-border-opacity, var(--fallback))",
        ),
      },
    },

    "dfr-text-link": {
      light: {
        color: colorfulPrimary,
      },
      dark: {
        color: config("theme.colors").red["400"],
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

  addUtilities(transformedNewClasses, { respectPrefix: false });
}

function hexToRgba(hex, a) {
  return mountRgbaString(...colorConvert.hex.rgb(hex).concat(a ? [a] : []));
}

function mountRgbaString(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
