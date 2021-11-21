const defaultTheme = require("tailwindcss/defaultTheme");

const COMMON_COLORS = {
  ["colorful-primary"]: {
    value: {
      100: defaultTheme.colors.yellow["500"],
      200: defaultTheme.colors.yellow["700"],
    },
  },
  ["colorful-secondary"]: {
    value: {
      100: defaultTheme.colors.red["700"],
      200: defaultTheme.colors.red["400"],
    },
  },
  ["color-dark-strong"]: {
    value: defaultTheme.colors.black,
  },
  ["color-light-strong"]: {
    value: defaultTheme.colors.white,
  },
};

const MY_THEME = {
  ["max-w-layout"]: {
    property: "maxWidth",
    value: defaultTheme.screens.md,
  },
  ["shadow"]: {
    property: "boxShadow",
    value: {
      light: "0px 0px 3px 0px rgba(0, 0, 0, 0.5)",
      dark: "0px 0px 3px 0px rgba(0, 0, 0, 0.2)",
    },
  },
  ["transition-opacity"]: {
    property: "",
    value: {
      transition: defaultTheme.transitionProperty.opacity,
      transitionDuration: defaultTheme.transitionDuration["500"],
      "&:hover": {
        opacity: defaultTheme.opacity[70],
      },
    },
  },

  ["bg-color-layout"]: {
    property: "backgroundColor",
    value: {
      light: defaultTheme.colors.white,
      dark: "#282c34",
    },
  },
  ["bg-color-primary"]: {
    property: "backgroundColor",
    value: {
      light: defaultTheme.colors.gray["100"],
      dark: defaultTheme.colors.gray["700"],
    },
  },

  ["border-color-primary"]: {
    property: "borderColor",
    value: {
      light: defaultTheme.colors.gray["200"],
      dark: defaultTheme.colors.gray["600"],
    },
  },

  ["text-color-primary"]: {
    property: "color",
    value: {
      light: defaultTheme.colors.gray["700"],
      dark: defaultTheme.colors.gray["100"],
    },
  },
  ["text-color-secondary"]: {
    property: "color",
    value: {
      light: defaultTheme.colors.gray["500"],
      dark: defaultTheme.colors.gray["400"],
    },
  },

  ["link-color-primary"]: {
    property: "color",
    value: {
      light: COMMON_COLORS["colorful-primary"].value[100],
      dark: COMMON_COLORS["colorful-secondary"].value[200],
    },
  },

  ...enhanceTheme(COMMON_COLORS, ["bg", "text", "border"]),
};

module.exports = MY_THEME;

// --- Utils ---

function enhanceTheme(COMMON_COLORS, properties) {
  return Object.entries(COMMON_COLORS).reduce((result, [key, config]) => {
    const generatedProperties = properties.reduce((result, property) => {
      return {
        ...result,
        [`${property}-${key}`]: {
          property:
            property === "border" ? "borderColor" : property === "bg" ? "backgroundColor" : "color",
          value: config.value,
        },
      };
    }, {});

    return {
      ...result,
      ...generatedProperties,
    };
  }, {});
}
