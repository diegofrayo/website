const plugin = require("tailwindcss/plugin");
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
					dark: createTailwindStyleValue(config.property, config.value.dark, true),
				};

				// classes to use inside className prop (light/dark standard)
				result[`.dfr-${key}`] = enhancedValue.light;
				result[`.tw-dark .${e(`dark:dfr-${key}`)}`] = enhancedValue.dark;

				// classes to use with @apply directive
				result[`.${e(`dark-v-dfr-${key}`)}`] = enhancedValue.dark;
			} else {
				Object.keys(config.value).forEach((valueKey) => {
					// classes to use inside className prop (light/dark standard)
					result[`.dfr-${key}-${valueKey}`] = createTailwindStyleValue(
						config.property,
						config.value[valueKey],
					);
					result[`.tw-dark .${e(`dark:dfr-${key}-${valueKey}`)}`] = createTailwindStyleValue(
						config.property,
						config.value[valueKey],
						true,
					);
				});
			}
		} else if (typeof config.value === "string") {
			// classes to use inside className prop (light/dark standard)
			result[`.dfr-${key}`] = createTailwindStyleValue(config.property, config.value);
			result[`.tw-dark .${e(`dark:dfr-${key}`)}`] = createTailwindStyleValue(
				config.property,
				config.value,
				true,
			);
		}

		return result;
	}, {});
}

function utilitiesClassesTWPlugin({ addUtilities, e }) {
	const config = generateTailwindConfig(e);

	addUtilities(config, {
		respectPrefix: false,
		variants: [],
	});

	return config;
}

module.exports = {
	utilitiesClassesTWPlugin: plugin(utilitiesClassesTWPlugin),
	utilitiesClassesGenerator: utilitiesClassesTWPlugin,
};

// --- Utils ---

function hexToRgba(hex, a) {
	return mountRgbaString(...colorConvert.hex.rgb(hex).concat(a ? [a] : []));
}

function mountRgbaString(r, g, b, a) {
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function createTailwindStyleValue(property, value, addImportant) {
	if (["borderColor", "backgroundColor", "color"].includes(property)) {
		return {
			"--fallback": "1",
			[property]: `${hexToRgba(
				value,
				`var(--tw-${
					property === "borderColor" ? "border" : property === "backgroundColor" ? "bg" : "text"
				}-opacity, var(--fallback))`,
			)}  ${addImportant ? "!important" : ""}`.trim(),
		};
	}

	return {
		[property]: value,
	};
}
