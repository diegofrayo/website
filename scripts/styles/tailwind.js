const colorConvert = require("color-convert");
const MY_THEME = require("./theme");

function generateTailwindConfig(e) {
  return Object.entries(MY_THEME).reduce((result, [key, config]) => {
    if (config.value.light && config.value.dark) {
      const enhancedValue = key.startsWith("bg-")
        ? {
            light: {
              "--fallback": "1",
              backgroundColor: hexToRgba(
                config.value.light,
                "var(--tw-bg-opacity, var(--fallback))",
              ),
            },
            dark: {
              "--fallback": "1",
              backgroundColor: hexToRgba(
                config.value.dark,
                "var(--tw-bg-opacity, var(--fallback))",
              ),
            },
          }
        : key.startsWith("border-")
        ? {
            light: {
              "--fallback": "1",
              borderColor: hexToRgba(
                config.value.light,
                "var(--tw-border-opacity, var(--fallback))",
              ),
            },
            dark: {
              "--fallback": "1",
              borderColor: hexToRgba(
                config.value.dark,
                "var(--tw-border-opacity, var(--fallback))",
              ),
            },
          }
        : {
            light: {
              [config.property]: config.value.light,
            },
            dark: {
              [config.property]: config.value.dark,
            },
          };

      // classes to use with @apply directive
      result[`.${e(`light:v:dfr-${key}`)}`] = enhancedValue.light;
      result[`.${e(`dark:v:dfr-${key}`)}`] = enhancedValue.dark;

      // classes to use inside className prop (light/dark standard)
      result[`.dfr-${key}`] = enhancedValue.light;
      result[`.tw-dark .${e(`dark:dfr-${key}`)}`] = enhancedValue.dark;

      // classes to use inside className prop (light/dark inverted)
      result[`.${e(`light:vd:dfr-${key}`)}`] = enhancedValue.dark;
      result[`.tw-dark .${e(`dark:vl:dfr-${key}`)}`] = enhancedValue.light;
    } else {
      result[`.dfr-${key}`] = config.property
        ? {
            [config.property]: config.value,
          }
        : config.value;
    }

    return result;
  }, {});
}

module.exports = { generateTailwindConfig };

// --- Utils ---

function hexToRgba(hex, a) {
  return mountRgbaString(...colorConvert.hex.rgb(hex).concat(a ? [a] : []));
}

function mountRgbaString(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
