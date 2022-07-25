const fs = require("fs");
const colorConvert = require("color-convert");
const MY_THEME = require("./theme");

function main() {
	fs.writeFileSync("./src/styles/variables.post.css", generateCSSVars());
}

main();

// --- Utils ---

function generateCSSVars() {
	const lightModeOutput = Object.entries(MY_THEME).reduce((result, [item, config]) => {
		if (config.property === "") return result;

		if (typeof config.value === "object" && config.value.light && config.value.dark) {
			result += `--dfr-${item}: ${hexToRgba(config.property, config.value.light)};\n`;
		} else if (typeof config.value === "string") {
			result += `--dfr-${item}: ${hexToRgba(config.property, config.value)};\n`;
		}

		return result;
	}, "");

	const darkModeOutput = Object.entries(MY_THEME).reduce((result, [item, config]) => {
		if (config.property === "") return result;

		if (typeof config.value === "object" && config.value.light && config.value.dark) {
			result += `--dfr-${item}: ${hexToRgba(config.property, config.value.dark)};\n`;
		}

		return result;
	}, "");

	return `body { ${lightModeOutput} } \n\n .tw-dark body { ${darkModeOutput} }`;
}

// --- Utils ---

function hexToRgba(property, value, alpha) {
	if (property.includes("color")) {
		return mountRgbaString(...colorConvert.hex.rgb(value).concat(alpha ? [alpha] : []));
	}

	return value;
}

function mountRgbaString(r, g, b, a = 1) {
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}
