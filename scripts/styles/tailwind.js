const colorConvert = require("color-convert");
const MY_THEME = require("./theme");

function generateTailwindConfig(e) {
  return Object.entries(MY_THEME).reduce((result, [key, config]) => {
    if (!config.property) {
      result[`.dfr-${key}`] = config.value;
    } else if (typeof config.value === "object") {
      if (config.value.light && config.value.dark) {
        const enhancedValue = {
          light: createTailwindStyleValue(config.property, config.value.light),
          dark: createTailwindStyleValue(config.property, config.value.dark),
        };

        // classes to use inside className prop (light/dark standard)
        result[`.dfr-${key}`] = enhancedValue.light;
        result[`.tw-dark .${e(`dark:dfr-${key}`)}`] = enhancedValue.dark;

        // classes to use with @apply directive
        result[`.${e(`dark:v:dfr-${key}`)}`] = enhancedValue.dark;
      } else {
        Object.keys(config.value).forEach((valueKey) => {
          const enhancedValue = createTailwindStyleValue(config.property, config.value[valueKey]);

          // classes to use inside className prop (light/dark standard)
          result[`.dfr-${key}-${valueKey}`] = enhancedValue;
          result[`.tw-dark .${e(`dark:dfr-${key}-${valueKey}`)}`] = enhancedValue;
        });
      }
    } else if (typeof config.value === "string") {
      const enhancedValue = createTailwindStyleValue(config.property, config.value);

      // classes to use inside className prop (light/dark standard)
      result[`.dfr-${key}`] = enhancedValue;
      result[`.tw-dark .${e(`dark:dfr-${key}`)}`] = enhancedValue;
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

function createTailwindStyleValue(property, value) {
  if (["borderColor", "backgroundColor"].includes(property)) {
    return {
      "--fallback": "1",
      [property]: hexToRgba(
        value,
        `var(--tw-${property === "borderColor" ? "border" : "bg"}-opacity, var(--fallback))`,
      ),
    };
  }

  return {
    [property]: value,
  };
}
