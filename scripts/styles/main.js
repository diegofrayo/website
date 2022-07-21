const fs = require("fs");

const MY_THEME = require("./theme");
const { utilitiesClassesGenerator } = require("./tailwind");

function main() {
	fs.writeFileSync("./src/styles/variables.post.css", generateCSSVars());
}

main();

// --- Utils ---

function generateCSSVars() {
	const output = Object.entries(MY_THEME).reduce((result, [item, config]) => {
		if (config.property === "") return result;

		if (typeof config.value === "object") {
			if (config.value.light && config.value.dark) {
				result += `--dfr-${item}: ${config.value.light};\n`;
				result += `--dark--dfr-${item}: ${config.value.dark};\n`;
			} else {
				Object.keys(config.value).forEach((valueKey) => {
					result += `--dfr-${item}-${valueKey}: ${config.value[valueKey]};\n`;
				});
			}
		} else if (typeof config.value === "string") {
			result += `--dfr-${item}: ${config.value};\n`;
		}

		return result;
	}, "");

	return `body { ${output} }`;
}

function generateUtilities() {
	const utilitiesClasses = utilitiesClassesGenerator({
		e: (selector) => selector,
		addUtilities: () => undefined,
	});

	return `@layer utilities {${Object.keys(utilitiesClasses).reduce((result, cssSelector, index) => {
		return (
			result +
			`${cssSelector.replace(":", "\\:")} { ${Object.keys(utilitiesClasses[cssSelector])
				.map((key) => {
					if (typeof utilitiesClasses[cssSelector][key] !== "string") {
						console.log(cssSelector);
						return "";
					}

					return `${key === "--fallback" ? key : kebabize(key)}: ${
						utilitiesClasses[cssSelector][key]
					};`;
				})
				.join("")}  }`
		);
	}, "")}}`;
}

function kebabize(str) {
	return str
		.split("")
		.map((letter, idx) => {
			return letter.toUpperCase() === letter
				? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
				: letter;
		})
		.join("");
}
