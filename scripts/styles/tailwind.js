require("./css-vars");
const plugin = require("tailwindcss/plugin");
const MY_THEME = require("./theme");

function generateTailwindConfig(e) {
	return Object.entries(MY_THEME).reduce((result, [key, config]) => {
		if (config.property === "") {
			result[`.dfr-${key}`] = config.value;
		} else if (
			(typeof config.value === "object" && config.value.light && config.value.dark) ||
			typeof config.value === "string"
		) {
			result[`.dfr-${key}`] = createTailwindStyleValue({ property: config.property, key });
		}

		return result;
	}, {});
}

function dfrUtilitiesPlugin({ addUtilities, e }) {
	const config = generateTailwindConfig(e);

	addUtilities(config, {
		respectPrefix: false,
		variants: [],
	});
}

module.exports = plugin(dfrUtilitiesPlugin);

// --- Utils ---

function createTailwindStyleValue({ property, key }) {
	if (["borderColor", "backgroundColor", "color"].includes(property)) {
		return {
			"--fallback": "1",
			[property]: `var(--dfr-${key})`,
		};
	}

	return {
		[property]: `var(--dfr-${key})`,
	};
}
