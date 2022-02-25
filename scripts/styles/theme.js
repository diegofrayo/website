const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const COMMON_COLORS = {
  ["colorful-primary"]: {
    value: {
      100: colors.yellow["600"],
      200: colors.yellow["700"],
    },
  },
  ["colorful-secondary"]: {
    value: {
      100: colors.red["700"],
      200: colors.red["400"],
    },
  },
  ["color-dark-strong"]: {
    value: colors.black,
  },
  ["color-light-strong"]: {
    value: colors.white,
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
      light: colors.white,
      dark: "#282c34",
    },
  },
  ["bg-color-primary"]: {
    property: "backgroundColor",
    value: {
      light: colors.gray["100"],
      dark: colors.gray["700"],
    },
  },

  ["border-color-primary"]: {
    property: "borderColor",
    value: {
      light: colors.gray["200"],
      dark: colors.gray["600"],
    },
  },

  ["text-color-primary"]: {
    property: "color",
    value: {
      light: colors.gray["700"],
      dark: colors.gray["100"],
    },
  },
  ["text-color-secondary"]: {
    property: "color",
    value: {
      light: colors.gray["500"],
      dark: colors.gray["400"],
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
        ...(property === "border"
          ? ["t", "r", "b", "l", "all"].reduce((result, curr) => {
              return {
                ...result,
                [`${property}${curr === "all" ? "" : `-${curr}`}-${key}`]: {
                  property:
                    curr === "t"
                      ? "borderTopColor"
                      : curr === "r"
                      ? "borderRightColor"
                      : curr === "b"
                      ? "borderBottomColor"
                      : curr === "l"
                      ? "borderLeftColor"
                      : "borderColor",
                  value: config.value,
                },
              };
            }, {})
          : {
              [`${property}-${key}`]: {
                property: property === "bg" ? "backgroundColor" : "color",
                value: config.value,
              },
            }),
      };
    }, {});

    return {
      ...result,
      ...generatedProperties,
    };
  }, {});
}
